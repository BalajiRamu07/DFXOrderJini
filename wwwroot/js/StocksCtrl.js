/**
 * Created by shreyasgombi on 05/03/20.
 */

angular.module('ebs.controller')

    .controller("StocksCtrl",function ($scope, $filter, $http, $modal, $window, $interval,$sce,$mdDialog) {
        console.log("Hello From Stocks Controller .... !!!!");

        $scope.stocksSearch = {};
        $scope.stocksSearch.filter = '';

        $scope.filter = {};
        $scope.filter.sales = 'All';
        $scope.filter.sales.seller = '';
        $scope.filter.branch = 'All';

        $scope.displayStocksRefresh = true;
        var stocksSearchBy = ['dealercode', 'dealername', 'product','itemcode','City', 'seller','SellerName', 'StockistName', 'Area', 'Phone', 'email'];

        //New Pagination variables
        $scope.viewLength = 0;
        $scope.newViewBy = 10;
        var viewBy = {};
        viewBy.stocks = 10;
        var initialViewBy = 60;
        var localViewBy = $scope.newViewBy;

        //stocks
        var stockSearchObj = {};
        stockSearchObj.viewLength = 0;
        stockSearchObj.viewBy = initialViewBy;
        stockSearchObj.searchBy = stocksSearchBy;

        $scope.refreshStocks = function(){
            $http.post("/dash/stock", stockSearchObj)
                .success(function (res) {
                    $scope.stocks = res;
                })
            $http.post("/dash/stock/count", stockSearchObj)
                .success(function (res) {
                    $scope.transactionCount(res,12);
                })
        }
        $scope.refreshStocks();

        $scope.transactionCount = function(response, tab){
            if(response){
                if(response > viewBy.stocks){
                    $scope.stock_count = response;
                    $scope.viewLength = 0;
                    $scope.newViewBy = viewBy.stocks;
                }
                else if(response <= viewBy.stocks){
                    $scope.stock_count = response;
                    $scope.newViewBy = response;
                }
                else{
                    $scope.stocks = [];
                    $scope.newViewBy = 1;
                    $scope.stock_count = 0;
                    $scope.viewLength = -1;
                }
            }else{
                $scope.stocks = [];
                $scope.newViewBy = 1;
                $scope.stock_count = 0;
                $scope.viewLength = -1;
            }
        }

        $scope.refreshTransactions = function(tab){
            stockSearchObj = {};
            stockSearchObj.viewLength = 0;
            stockSearchObj.viewBy = initialViewBy;
            stockSearchObj.from_date = 0;
            stockSearchObj.to_date = 0;
            stockSearchObj.filter = '';
            stockSearchObj.searchFor = '';
            stockSearchObj.searchBy = [];
            $scope.stocksSearch.filter = '';

            $scope.displayStocksRefresh = false;

            $scope.refreshStocks();
        }

        $scope.navPage = function(tab, direction){
            var viewLength = $scope.viewLength;
            var viewBy = $scope.newViewBy;

            if(direction){
                //console.log("NEXT");
                if(viewLength + viewBy >= $scope.stocks.length){
                    if(viewLength + viewBy < $scope.stock_count){

                        viewLength += viewBy;
                        //console.log("Fetch more");
                        stocksSearchObj = {};
                        stocksSearchObj.viewLength = viewLength;
                        stocksSearchObj.viewBy = initialViewBy;
                        stocksSearchObj.searchFor = $scope.stockSearch.filter;
                        if($scope.filter.branch != 'All'){
                            stocksSearchObj.stockist = $scope.filter.branch;
                        }
                        else {
                            stocksSearchObj.stockist = '';
                        }

                        if($scope.filter.class != 'All'){
                            stocksSearchObj.class = $scope.filter.class;
                        }
                        else {
                            stocksSearchObj.class = '';
                        }

                        if($scope.filter.sales != 'All'){
                            stocksSearchObj.seller = $scope.filter.sales.seller;
                        }
                        else{
                            stocksSearchObj.seller = '';
                        }
                        stocksSearchObj.searchBy = stocksSearchBy;

                        jQuery.noConflict();
                        $('.refresh').css("display", "inline");
                        $http.post("/dash/stock",stocksSearchObj)
                            .success(function(response) {
                                if(response.length){
                                    for(var i=0 ; i< response.length; i++){
                                        $scope.stocks.push(response[i]);
                                    }
                                }
                                //$scope.stocks = response;

                                if (viewLength + viewBy > $scope.stock_count) {
                                    a = viewLength + viewBy - $scope.stock_count;
                                    viewBy -= a;
                                    $scope.newViewBy = viewBy;
                                }
                                $scope.viewLength = viewLength;

                            })
                            .error(function(error, status){
                                console.log(error, status);
                                if(status >= 400 && status < 404)
                                    $window.location.href = '/404';
                                else if(status >= 500)
                                    $window.location.href = '/500';
                                else
                                    $window.location.href = '/404';
                            });

                        jQuery.noConflict();
                        $('.refresh').css("display", "none");
                    }
                    else{
                        //console.log("Out of data")
                        if(viewLength + viewBy > $scope.stock_count){
                            a = viewLength + viewBy - $scope.stock_count;
                            viewBy -= a;
                            $scope.newViewBy = viewBy;
                        }
                    }
                }
                else{
                    //console.log("Minus viewby")
                    viewLength += viewBy;

                    if(viewLength + viewBy > $scope.stock_count){
                        a = viewLength + viewBy - $scope.stock_count;
                        viewBy -= a;
                    }
                    $scope.newViewBy = viewBy;
                    $scope.viewLength = viewLength;
                }
            }
            else{
                //console.log("BACK");
                if(viewLength < viewBy){
                    //console.log("NO DATA")
                }
                else{
                    if(viewLength + viewBy >= $scope.stock_count){
                        viewBy += a;
                        a = 0;
                    }

                    viewLength -= viewBy;

                    $scope.viewLength = viewLength;
                    $scope.newViewBy = viewBy;
                }
            }
        }

        $scope.selectStockDealer = function(dealerName){
            $scope.stocksSearch.filter = dealerName;
            $scope.stocksSearchFilter();
        }

        $scope.stockSearch = {};
        //Store filter function
        $scope.stocksSearchFilter = function(){
            stockSearchObj = {};
            stockSearchObj.viewLength = 0;
            stockSearchObj.viewBy = initialViewBy;
            stockSearchObj.searchBy = stocksSearchBy;
            $scope.viewLength = 0;
            $scope.newViewBy = localViewBy;

            if($scope.stocksSearch.filter){
                stockSearchObj.searchFor = $scope.stocksSearch.filter;
            }

            stockSearchObj.stockist = {};
            if($scope.filter.branch != 'All'){
                stockSearchObj.stockist = $scope.filter.branch;
            }
            else {
                stockSearchObj.stockist = '';
            }

            if($scope.filter.sales != 'All'){
                stockSearchObj.seller = $scope.filter.sales;
            }
            else{
                stockSearchObj.seller = '';
            }

            $scope.stocks = [];

            $scope.refreshStocks();


            // $scope.showStockFilter = true;
            //
            // if($scope.dealerSearch.filter == '' && $scope.filter.branch == 'All' && $scope.filter.sales == 'All')
            //     $scope.showStockFilter = false;
        };

        $scope.clearFilter = function(tab){
            stockSearchObj = {};
            stockSearchObj.viewLength = 0;
            stockSearchObj.viewBy = initialViewBy;
            stockSearchObj.searchFor = '';
            stockSearchObj.seller = '';
            stockSearchObj.stockist = '';
            stockSearchObj.searchBy = [];

            $scope.viewLength = 0;
            $scope.newViewBy = viewBy.dealer;
            $scope.stocksSearch.filter = '';
            $scope.stocks = [];

            $scope.refreshStocks();
        }

        $scope.clearFilterButton = function (search,tab){
            if(!search){
                stockSearchObj = {};
                stockSearchObj.viewLength = 0;
                stockSearchObj.viewBy = initialViewBy;
                stockSearchObj.searchFor = '';
                stockSearchObj.seller = '';
                stockSearchObj.stockist = '';
                stockSearchObj.searchBy = [];

                $scope.viewLength = 0;
                $scope.newViewBy = viewBy.dealer;
                $scope.stockSearch.filter = '';
                $scope.stocks = [];

                $scope.refreshStocks();
            }
        }

    })
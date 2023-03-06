using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Drawing;
using DFXOrderJini.Models;
using DFXOrderJini.Repository;
using System.Reflection;
using Newtonsoft.Json;
using NuGet.Protocol.Plugins;

namespace DFXOrderJini.Controllers
{
    [Produces("application/json")]

    [ApiController]
    public partial class OrdersController : ControllerBase
    {
        [Route("api/Orders/GetCRD_Date_HolidayList")]
        [HttpPost]
        public IEnumerable<CustomerModel> GetCRD_Date_HolidayList(string Orderdate, string plant)
        {
            OrdersDataLayer order = new OrdersDataLayer();


            return order.GetCRD_Date_HolidayList(Orderdate, plant);
        }

        [Route("api/Orders/GetCustomers")]
        [HttpPost]
        public IEnumerable<CustomerModel> GetCustomers(string DealerName, string SearchName)
        {
            OrdersDataLayer order = new OrdersDataLayer();


            return order.GetCustomers(DealerName.Trim().ToString(), SearchName);
        }
        [Route("api/Orders/GetPlantDetails")]
        [HttpPost]
        public IEnumerable<CustomerModel> GetPlantDetails(string DealerCode)
        {
            OrdersDataLayer order = new OrdersDataLayer();


            return order.GetPlantDetails(DealerCode.Trim().ToString());
        }
        [Route("api/Orders/ChangePlantByAdmin")]
        [HttpPost]
        public IEnumerable<CustomerModel> ChangePlantByAdmin(string DealerCode, string PlantCode)
        {
            OrdersDataLayer order = new OrdersDataLayer();


            return order.ChangePlantByAdmin(DealerCode.Trim().ToString(), PlantCode);
        }
        [Route("api/Orders/GetDealersDetails")]
        [HttpPost]
        public IEnumerable<CustomerModel> GetDealersDetails(string DealerCode)
        {
            OrdersDataLayer order = new OrdersDataLayer();


            return order.GetDealersDetails(DealerCode.Trim().ToString());
        }
        [Route("api/Orders/Create_RepeatOrder")]
        [HttpPost]
        public IEnumerable<CustomerModel> Create_RepeatOrder(string DealerName, string SearchName)
        {
            OrdersDataLayer order = new OrdersDataLayer();


            return order.Create_RepeatOrder(DealerName, SearchName);
        }
        [Route("api/Orders/GetOrders")]
        [HttpPost]
        public IEnumerable<OrderCreationModel> GetOrders(string DealerCode,string SearchName)
        {
            OrdersDataLayer order = new OrdersDataLayer();
           
            List<OrderCreationModel> saleList = order.GetOrders(DealerCode.Trim().ToString(), SearchName).ToList<OrderCreationModel>();
            
            return saleList;
        }
        [Route("api/Orders/GetOrdersId")]
        [HttpPost]
        public IEnumerable<OrderCreationModel> GetOrdersId(string DealerCode, string OrderId)
        {
            OrdersDataLayer order = new OrdersDataLayer();
            List<OrderCreationModel> saleList = order.GetOrdersid(DealerCode.Trim().ToString(), OrderId).ToList<OrderCreationModel>();

            return saleList;
        }
        [Route("api/Orders/GetItems")]
        [HttpPost]
        public IEnumerable<OrderCreationModel> GetItems(string DealerCode,string ProfileName)
        {
            OrdersDataLayer order = new OrdersDataLayer();
            List<OrderCreationModel> saleList = order.GetItems(DealerCode.Trim().ToString(), ProfileName).ToList<OrderCreationModel>();

            return saleList;
        }

        [Route("api/Orders/GetOrderHistory_Items")]
        [HttpPost]
        public IEnumerable<OrderCreationModel> GetOrderHistory_Items(string OrderId, string ProfileName)
        {
            OrdersDataLayer order = new OrdersDataLayer();
            List<OrderCreationModel> saleList = order.GetOrderHistory_Items(OrderId.Trim().ToString(), ProfileName).ToList<OrderCreationModel>();

            return saleList;
        }
        [Route("api/Orders/RemoveOrderItems")]
        [HttpPost]
        public IEnumerable<CustomerModel> RemoveOrderItems(string DealerCode, int ItemID)
        {
            OrdersDataLayer order = new OrdersDataLayer();


            return order.RemoveOrderItems(DealerCode.Trim().ToString(), ItemID);
        }
        [Route("api/Orders/GetVehicleDetails")]
        [HttpPost]
        public IEnumerable<CustomerModel> GetVehicleDetails(string DealerCode)
        {
            OrdersDataLayer order = new OrdersDataLayer();


            return order.GetVehicleDetails(DealerCode.Trim().ToString());
        }
        [Route("api/Orders/LoadVehicleDetails")]
        [HttpPost]
        public IEnumerable<OrderCreationModel> LoadVehicleDetails(string DealerCode)
        {
            OrdersDataLayer order = new OrdersDataLayer();
            List<OrderCreationModel> saleList = order.LoadVehicleDetails(DealerCode.Trim().ToString()).ToList<OrderCreationModel>();

            return saleList;
        }
        [Route("api/Orders/GetProductItems")]
        [HttpPost]
        public IEnumerable<OrderCreationModel> GetProductMaster_Items(string DealerCode)
        {
            OrdersDataLayer order = new OrdersDataLayer();
            return order.GetProductItems(DealerCode.Trim().ToString());
        }
        [Route("api/Orders/GetProductGrade")]
        [HttpPost]
        public IEnumerable<OrderCreationModel> GetProductGrade(string Item, string DealerCode)
        {
            OrdersDataLayer order = new OrdersDataLayer();
            return order.GetProductGrade("SelectGrade", "grade", Item, "", "","", DealerCode.Trim().ToString());
        }
        [Route("api/Orders/GetProductDensity")]
        [HttpPost]
        public IEnumerable<OrderCreationModel> GetProductDensity(string Item, string Item1, string DealerCode)
        {
            OrdersDataLayer order = new OrdersDataLayer();
            return order.GetProductGrade("SelectDensity", "Density", Item, Item1, "","", DealerCode.Trim().ToString());
        }
        [Route("api/Orders/GetProductPrimaryUOM")]
        [HttpPost]
        public IEnumerable<OrderCreationModel> GetProductPrimaryUOB(string Item, string Item1)
        {
            OrdersDataLayer order = new OrdersDataLayer();
            return order.GetProductGrade("SelectDisplayUOM", "UOM", Item, Item1, "","","");
        }
        [Route("api/Orders/GetProductLenth")]
        [HttpPost]
        public IEnumerable<OrderCreationModel> GetProductLenth(string Item, string Item1)
        {
            OrdersDataLayer order = new OrdersDataLayer();
            return order.GetProductGrade("SelectLength", "Lmax", Item, Item1, "","","");
        }
        [Route("api/Orders/GetProductWidth")]
        [HttpPost]
        public IEnumerable<OrderCreationModel> GetProductWidth(string Item, string Item1)
        {
            OrdersDataLayer order = new OrdersDataLayer();
            return order.GetProductGrade("SelectWidth", "WMax", Item, Item1, "","","");
        }
        [Route("api/Orders/GetProductThickness")]
        [HttpPost]
        public IEnumerable<OrderCreationModel> GetProductThickness(string Item, string Item1, string Item2)
        {
            OrdersDataLayer order = new OrdersDataLayer();
            return order.GetProductGrade("SelectThickness", "Thickness", Item, Item1, Item2,"","");
        }
        [Route("api/Orders/GetBundleCalculatepieces")]
        [HttpPost]
        public IEnumerable<OrderCreationModel> GetBundleCalculatepieces(string Item, string Item1, string Item2, string Item3)
        {
            OrdersDataLayer order = new OrdersDataLayer();
            return order.GetProductGrade("SelectTotalpieces", "Total_pieces", Item, Item1, Item2, Item3,"");
        }
        [Route("api/Orders/LoadShippingAddress")]
        [HttpPost]
        public IEnumerable<OrderCreationModel> LoadShippingAddress(string DealerCode)
        {
            OrdersDataLayer order = new OrdersDataLayer();
            return order.LoadShippingAddress(DealerCode.Trim().ToString());
        }
        [Route("api/Orders/ChangeShippingAddress")]
        [HttpPost]
        public IEnumerable<OrderCreationModel> ChangeShippingAddress(string Item1, string Item, string DealerCode)
        {
            OrdersDataLayer order = new OrdersDataLayer();
            return order.ChangeShippingAddress( Item, Item1, DealerCode.Trim().ToString());
        }
    }
}

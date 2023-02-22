using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Threading.Tasks;
using DFXOrderJini.Models;

namespace DFXOrderJini.Interface
{
    public interface IOrders
    {
        IList<OrderCreationModel> GetOrders();
        IList<CustomerModel> GetCustomers();
        IList<CustomerModel> GetDealersDetails(string DealerCode);
        IList<OrderCreationModel> GetProductItems(string DealerCode);
        IList<OrderCreationModel> GetProductGrade(string Flag, string Coloumn, string Search1, string Search2, string Search3, string Search4, string DealerCode);
    }
}
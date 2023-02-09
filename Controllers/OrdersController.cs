using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Drawing;
using DFXOrderJini.Models;
using DFXOrderJini.Repository;

namespace DFXOrderJini.Controllers
{
    
    [ApiController]
    public class OrdersController : ControllerBase
    {
       // private IOrders order = new OrdersDataLayer();

        [Route("api/Orders/AjaxMethod")]
        [HttpPost]
        public IEnumerable<OrderCreationModel> AjaxMethod()
        {
            OrdersDataLayer order = new OrdersDataLayer();
            
            return order.GetOrders();

        }
    }
}

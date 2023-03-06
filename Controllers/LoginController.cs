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
    public partial class LoginController : ControllerBase
    {

        [Route("api/Login/LoginCheck")]
        [HttpPost]
        public IEnumerable<CustomerModel> LoginCheck(string Name,string DealerName)
        {
            OrdersDataLayer order = new OrdersDataLayer();


            return order.LoginCheck(Name, DealerName);
        }
    }
}

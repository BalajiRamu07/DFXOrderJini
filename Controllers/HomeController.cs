using DFXOrderJini.Models;
using DFXOrderJini.Repository;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
namespace DFXOrderJini.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public IActionResult FoamOrderCreation(OrderCreationModel Order)
        {
           
            try

            {

                OrdersDataLayer order = new OrdersDataLayer();


                order.Foam_OrderCreation(Order);

            }

            catch (Exception)

            {

                

            }



            return View();
        }
        public IActionResult UserProfile()
        {
            return View();
        }
        public IActionResult CustomersList()
        {

            return View();
        }
        public IActionResult Privacy()
        {
            return View();
        }
        public IActionResult OrderCreation()
        {
            return View();
        }
        public IActionResult OrderItems()
        {
            return View();
        }
        public IActionResult OrderDetails()
        {
            return View();
        }
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
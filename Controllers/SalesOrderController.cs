using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DFXOrderJini.Controllers
{
    public class SalesOrderController : Controller
    {
        // GET: SalesOrderController
        public ActionResult Index()
        {
            return View();
        }

        // GET: SalesOrderController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: SalesOrderController/Create
        public ActionResult Create()
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
        // POST: SalesOrderController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: SalesOrderController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: SalesOrderController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: SalesOrderController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: SalesOrderController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}

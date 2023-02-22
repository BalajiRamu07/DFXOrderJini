using DFXOrderJini.Models;
using DFXOrderJini.Repository;
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
        public ActionResult OrderHistory()
        {
            return View();
        }
        public ActionResult OrderDetails()
        {
            return View();
        }
        public IActionResult OrderCreation()
        {
           
           // TempData["DealerCode"] = DealerCode.Trim().ToString();
            return View();
        }
        [Route("api/SalesOrder/OrderCreate")]
        [HttpPost]
        public int OrderCreate(string ItemName, string Grade, string Density, string PrimaryUOM, string Lmax, string Wmax,string Tmax,
            string QTY, string Pieces, string LDPE, string DealerCode,string Volume)
        {
            
            OrderCreationModel Order = new OrderCreationModel();
            Order.ItemName = ItemName;
            Order.Grade = Grade;
            Order.Density = Density;
            Order.PrimaryUOM= PrimaryUOM;
            Order.Lmax= Lmax;
            Order.Wmax= Wmax;
            Order.Tmax= Tmax;
            Order.QTY= QTY;
            Order.Pieces= Pieces;
            Order.LDPE= LDPE;
            Order.Volume= Volume;
            Order.CRD_Date= Convert.ToDateTime("01/01/1900"); 
            Order.DealerCode= DealerCode.Trim().ToString();
            Order.Flag = "S";
            OrdersDataLayer order = new OrdersDataLayer();
            
            int b = 0;
            return b=order.Foam_OrderCreation(Order);
        }
        [Route("api/SalesOrder/OrderItemUpdate")]
        [HttpPost]
        public int OrderItemUpdate(string Cust_Ref, string Comments, string VehicleCode, string PlantCode, string CRD_Date, string Wmax, string Tmax,
            string QTY, string Pieces, string LDPE, string DealerCode, string OrderID, string Volume)
        {

            OrderCreationModel Order = new OrderCreationModel();

            if (Tmax == "ItemConfirm")
            {
               // Order.ItemName = Cust_Ref;
                Order.Cust_Comments = Comments;
                Order.Cust_Ref = Cust_Ref;
                Order.PlantCode = PlantCode;
                Order.CRD_Date = Convert.ToDateTime(CRD_Date);
                Order.VEHICLE_CODE = VehicleCode;
                Order.Flag = "U";
                Order.Status = "Confirm";
            }
            else if (Tmax == "ItemSave")
            {
               // Order.ItemName = Cust_Ref;
                Order.Cust_Comments = Comments;
                Order.Cust_Ref = Cust_Ref;
                Order.PlantCode = PlantCode;
                Order.CRD_Date = Convert.ToDateTime(CRD_Date);
                Order.VEHICLE_CODE = VehicleCode;
                Order.Flag = "SaveItem";
            }
            // Order.Lmax = Lmax;
            //Order.Wmax = Wmax;
            //Order.Tmax = Tmax;
            else if (Tmax == "Itemupdate")
            {

                Order.QTY = QTY;
                Order.Pieces = Pieces;
                Order.Volume = Volume;
                Order.ID = Convert.ToInt32(Wmax);
                Order.Flag = "UpdateItem";
            }
            //else if (Tmax == "ItemSave")
            //{

            //    Order.QTY = QTY;
            //    Order.Pieces = Pieces;
            //    Order.Volume = Volume;
            //    Order.ID = Convert.ToInt32(Wmax);
            //    Order.Flag = "SaveItem";
            //}

            //Order.LDPE = LDPE;
            //Order.Volume = Volume;
            Order.OrderID = OrderID;
            Order.DealerCode = DealerCode.Trim().ToString();

            OrdersDataLayer orderlay = new OrdersDataLayer();
            
            int b = 0;
            return b = orderlay.Foam_OrderCreation(Order);
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

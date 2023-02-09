using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
namespace DFXOrderJini.Models
{
    public class OrderCreationModel
    {
        ///<summary>
        /// Gets or sets Name.
        ///</summary>
        public int ID { get; set; }
        public string? OrderPlacedBy { get; set; }
        public string? DealerCode { get; set; }
        public string? ShippingAddress { get; set; }
        public string? PlantCode { get; set; }
        public string? Cust_Ref { get; set; }
        public string? Cust_Comments { get; set; }
        public string? CRD_Date { get; set; }
        public string? OrderID { get; set; }
        public string? OrderDate { get; set; }
        public string? OrderStatus { get; set; }
        public string? StandardOrder { get; set; }
        public string? SalesPerson { get; set; }
        public string? PrimaryUOM { get; set; }
        public string? ApprovedBy { get; set; }
        public string? Status { get; set; }


    }
            
}

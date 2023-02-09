
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;

using System.Data.SqlClient;
using System.Threading.Tasks;
using System.Configuration;
using DFXOrderJini.Repository;
using System;
using System.Collections.Generic;

using System.Linq;
using System.Threading.Tasks;
using StudentRecordManagementSystem.Utility;
using Microsoft.ApplicationBlocks.Data;
using System.Xml.Linq;
using Newtonsoft.Json;

namespace DFXOrderJini.Models
{
    public class OrdersDataLayer : IOrders
    {
        #region private Attributes
        private string _DealerName;
        private string _name;
        private string _NSearch;
        private int _result;
        #endregion

        #region Public Attributes
        DataTable dt = new DataTable();
        DataSet ds = new DataSet();
        string CS = ConnectionString.CName;
        public string DealerName { get { return _DealerName; } set { _DealerName = value; } }
        public string name { get { return _name; } set { _name = value; } }
        public string NSearch { get { return _NSearch; } set { _NSearch = value; } }
        public int result { get { return _result; } set { _result = value; } }
        #endregion

        #region Insert & Update & Get
        //To View all employees details
       
        public IList<OrderCreationModel> GetOrders()
    {
            List<OrderCreationModel> lstemployee = new List<OrderCreationModel>();

            try
            {
                name = "Orders";

                SqlParameter[] param = new SqlParameter[5];

                param[0] = new SqlParameter("@DealerName", DealerName);
                param[1] = new SqlParameter("@name", name);

                param[2] = new SqlParameter("@NSearch", NSearch);
              
                param[3] = new SqlParameter("@MStatus", SqlDbType.Int, 1);

                param[3].Direction = ParameterDirection.Output;

                param[4] = new SqlParameter("@ErrorMsg", SqlDbType.NVarChar, 1000);
                param[4].Direction = ParameterDirection.Output;

                ds = SqlHelper.ExecuteDataset(CS, CommandType.StoredProcedure, "GetOrderDetails", param);
                result = Convert.ToInt32(param[3].Value.ToString());
                       

                lstemployee = (from DataRow dr in ds.Tables[0].Rows
                                      select new OrderCreationModel()
                                      {
                                          ID = Convert.ToInt32(dr["ID"]),
                                          OrderID = dr["OrderID"].ToString(),
                                          Cust_Ref = dr["Cust_Ref"].ToString(),
                                          SalesPerson = dr["SalesPerson"].ToString()
                                      }).ToList();
            }
            catch
            {
                throw;
            }

            return lstemployee;
        }
        #endregion
       
    }
}



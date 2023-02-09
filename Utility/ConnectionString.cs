using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentRecordManagementSystem.Utility
{
    public static class ConnectionString
    {

        private static string cName = "Data Source=172.16.0.149;  Initial Catalog=DFXOrderjini;User ID=canopus;Password=India@123";
       

        public static string CName { get => cName; }
       

    }
}

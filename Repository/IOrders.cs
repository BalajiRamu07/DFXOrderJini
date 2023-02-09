using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Threading.Tasks;
using DFXOrderJini.Models;

namespace DFXOrderJini.Repository
{
    public interface IOrders
    {
        IList<OrderCreationModel> GetOrders();

    }
}
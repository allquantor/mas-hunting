using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DalskiAgent.Perception;
using SpatialAPI.Environment;
using KNPZebraLionLayer;
namespace KNPZebraLionLayer
{
	public class LionSensor :ISensor
	{
		private readonly IEnvironment environment;
        private readonly IKNPZebraLionLayer _lionLayer;

		public LionSensor (IEnvironment env, IKNPZebraLionLayer lionLayer)
        {
            environment = env;
            _lionLayer = lionLayer;
		}

		#region ISensor implementation

		public object Sense ()
		{
            var resultList = new List<ILion>();
            foreach (var resultEntry in environment.ExploreAll().OfType<Lion>())
            {
                resultList.Add(_lionLayer.GetLionById(resultEntry.AgentGuid));
            }
            return resultList;
        }

            //IEnumerable<Lion> lions = environment.ExploreAll().OfType<Lion>();
            //return lions;
		

		#endregion
	}
}


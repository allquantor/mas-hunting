using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DalskiAgent.Perception;
using SpatialAPI.Environment;


namespace KNPLionLayer.Sensors
{
	class ZebraSensor : ISensor
	{
		private readonly IEnvironment environment;
		public ZebraSensor(IEnvironment env)
		{
			environment = env;
		}

		object Sense()
		{
			IEnumerable<Zebra> elephants =  environment.ExploreAll().OfType<Zebra>();
			return elephants;

			// Einschränkung über die Postion des gesehenen Elefanten und der eigenen Position.
		}
	}
}

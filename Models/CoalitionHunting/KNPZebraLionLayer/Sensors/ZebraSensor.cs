﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DalskiAgent.Perception;
using SpatialAPI.Environment;
using KNPZebraLionLayer;


namespace KNPZebraLionLayer
{
	internal class ZebraSensor : ISensor
	{
		private readonly IEnvironment environment;
		public ZebraSensor(IEnvironment env)
		{
			environment = env;
		}

		public object Sense()
		{
			IEnumerable<Zebra> zebras =  environment.ExploreAll().OfType<Zebra>();
			return zebras;
			//return 1;

			// Einschränkung über die Postion des gesehenen Elefanten und der eigenen Position.
		}
	}
}

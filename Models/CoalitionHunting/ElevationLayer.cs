﻿using System;
using System.IO;
using System.Windows.Forms;
using LCConnector.TransportTypes;
using LifeAPI.Layer;
using LIFEGisLayerService.Implementation;
using Mono.Addins;

[assembly: Addin]
[assembly: AddinDependency("LayerContainer", "0.1")]
namespace KNPElevationLayer
{
    [Extension(typeof(ISteppedLayer))]
    public class ElevationLayer : LIFEGisActiveLayer, IKNPElevationLayer
    {


        public override bool InitLayer(TInitData layerInitData, RegisterAgent registerAgentHandle, UnregisterAgent unregisterAgentHandle)
        {
            var path = Path.Combine("../../../Models/Skukuza/GISData/", "knp_srtm90m.asc");
            var filePath = Path.GetFullPath(path);

            LoadGISData(new Uri(filePath, UriKind.Absolute), "ElevationLayerKNP");

            return true;
        }

        public override void Tick()
        {

        }

        public override void PreTick()
        {

        }

        public override void PostTick()
        {

        }

        public string Name
        {
            get { return "ElevationLayer"; }
        }
    }
}


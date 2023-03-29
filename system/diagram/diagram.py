from diagrams import Cluster, Diagram, Edge
from diagrams.onprem.compute import Server
from diagrams.onprem.monitoring import Grafana
from diagrams.onprem.database import Mysql, Influxdb
from diagrams.onprem.network import Traefik
from diagrams.onprem.client import Users
from diagrams.generic.compute import Rack
from diagrams.generic.device import Mobile, Tablet
from diagrams.generic.network import Router
from diagrams.custom import Custom

with Diagram(name="bee•z", filename="beez", show=False, direction="LR",
             graph_attr={
                "bgcolor": "transparent",
                "pad": "0.25",
                "fontsize": "45"
            }):
    
    with Cluster("Portal"):
        router = Traefik("beez.link")
        rt_db = Mysql("Meta data")
        ts_db = Influxdb("Realtime data")
        backend = Rack()
        visualization =  Grafana("graph.beez.link")
        router >> backend >> [rt_db, ts_db]
        backend >> visualization >> [rt_db, ts_db]

    Users("Bee keepers") - [Mobile("mobile"), 
                           Tablet("tablet")] >> router

    lorawan_network = Router("LoRaWAN network")
    beez_lora_wan_gateway = Custom("bee•z gateway", "./res/gateway.png")
    lora_wan_node_1 = Custom("bee•z node", "./res/node.png")
    lora_wan_node_2 = Custom("bee•z node", "./res/node.png")

    [lora_wan_node_1, lora_wan_node_2] >> beez_lora_wan_gateway
    beez_lora_wan_gateway - lorawan_network - backend


    
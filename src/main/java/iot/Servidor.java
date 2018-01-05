package iot;


import com.corundumstudio.socketio.listener.*;
import com.corundumstudio.socketio.*;

public class Servidor {

    public static void main(String[] args) throws InterruptedException {

        Configuration config = new Configuration();
        config.setHostname("192.168.2.92");
        config.setPort(9092);

        final SocketIOServer server = new SocketIOServer(config);
        server.addEventListener("pintoggle", IOTData.class, new DataListener<IOTData>() {
            @Override
            public void onData(SocketIOClient client, IOTData data, AckRequest ackRequest) {
            	
            	
            	System.out.println("PinTotggle: "+data);
            	
                // broadcast messages to all clients
                server.getBroadcastOperations().sendEvent("pintoggle", data);
                
                
            }
        });
        
        server.addEventListener("analogicdata", String.class, new DataListener<String>() {
            @Override
            public void onData(SocketIOClient client, String data, AckRequest ackRequest) {
            	
            	
            
                // broadcast messages to all clients
                server.getBroadcastOperations().sendEvent("analogicdata", data);
                
                
            }
        });

        server.start();

        Thread.sleep(Integer.MAX_VALUE);

        server.stop();
    }

}

package util;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.Charset;

import org.apache.mina.core.service.IoAcceptor;
import org.apache.mina.core.service.IoHandler;
import org.apache.mina.core.session.IdleStatus;
import org.apache.mina.core.session.IoSession;
import org.apache.mina.filter.codec.ProtocolCodecFilter;
import org.apache.mina.filter.codec.textline.TextLineCodecFactory;
import org.apache.mina.filter.logging.LoggingFilter;
import org.apache.mina.transport.socket.nio.NioSocketAcceptor;
import org.springframework.web.bind.annotation.RequestBody;

import cliente.Cliente;

public class MinaTeste {

	public static void main(String[] args) throws IOException{
		     IoAcceptor acceptor = new NioSocketAcceptor();
	        acceptor.getFilterChain().addLast( "logger", new LoggingFilter() );
	        acceptor.getFilterChain().addLast( "codec", new ProtocolCodecFilter( new TextLineCodecFactory( Charset.forName( "UTF-8" ))));
	        acceptor.setHandler( new TimeServerHandler() );
	        acceptor.getSessionConfig().setReadBufferSize( 2048 );
	        acceptor.getSessionConfig().setIdleTime( IdleStatus.BOTH_IDLE, 10 );
	        acceptor.bind( new InetSocketAddress(1220) );
	}
	
	
	
	
	
}




 class TimeServerHandler implements IoHandler  {

	@Override
	public void exceptionCaught(IoSession arg0, Throwable arg1) throws Exception {
		
		
		System.out.println("Ocorreu um erro");
		
	}

	@Override
	public void messageReceived(IoSession session,  Object message) throws Exception {
		
		
		
		System.out.println("messageReceived");
		System.out.println(message);
		System.out.println("----");
		
	}

	@Override
	public void messageSent(IoSession arg0, Object arg1) throws Exception {
		
		System.out.println("messageSent");
		
	}

	@Override
	public void sessionClosed(IoSession arg0) throws Exception {
		
		System.out.println("sessionClosed");
		
	}

	@Override
	public void sessionCreated(IoSession arg0) throws Exception {
		
		System.out.println("sessionCreated");
		
	}

	@Override
	public void sessionIdle(IoSession arg0, IdleStatus arg1) throws Exception {
		
		System.out.println("sessionIdle");
	}

	@Override
	public void sessionOpened(IoSession arg0) throws Exception {
		
		System.out.println("sessionOpened");
		
	}
	
}

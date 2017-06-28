package util;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class SpringUtil {

	private static ApplicationContext context = new ClassPathXmlApplicationContext("WEB-INF/springapp-servlet.xml");

	public static Object getBean(String ob){

		return  context.getBean(ob);

	}

}

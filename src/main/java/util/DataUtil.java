package util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DataUtil {

	private Calendar c;

	public DataUtil(){

		c =  Calendar.getInstance();
		c.setTime(new Date());
	} 

	public DataUtil(String data){

		c =  Calendar.getInstance();
		try {
			c.setTime(new SimpleDateFormat("dd/MM/yyyy").parse(data));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	} 

	public int getDiaMes(){

		return c.get(Calendar.DAY_OF_MONTH);
	}



	public  int getMes(){

		return c.get(Calendar.MONTH)+1;
	}

	public  int getAno(){

		return c.get(Calendar.YEAR);
	}

	public static Date formatData(String data){
		
		if(data==null)
			return null;
		
		
		
		if(data.matches("[\\d]*")){
			
		   data = 	getFormated(new Date(new Long(data)));
		}
		
		System.out.println("DAta em formatData: "+data);

		//Se estiver no formato yyyy-MM-dd
		if(data.matches("[\\d]{4}\\-[\\d]{2}\\-[\\d]{2}[\\w | \\W]*"))
			data = transformToBr(data);

		Date dataIso = null;

		String formatHora="";

		if(data.length()>10)
			formatHora="HH:mm:ss";
		
		String formData = "dd/MM/yyyy";
		
		if(data.matches("[\\d]{2}\\:[\\d]{2}\\:[\\d]{2}"))
			formData ="HH:mm:ss";

		SimpleDateFormat format = new SimpleDateFormat(formData+formatHora);

		try {

			dataIso = format.parse(data);
			System.out.print(data);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return dataIso;
	} 

	//Transforma uma data yyyy-MM-dd para dd/MM/yyy
	public  static String transformToBr(String data){
		
		if(data==null)
			return null;

		String format  = data.substring(8,10)+"/"+data.substring(5,7)+"/"+data.substring(0,4);
		System.out.println("Data Formatada: "+format);
		return format;

	}
	
      public static String getIsoFormat(Date data){
    	  
    	if(data==null)
  			return null;
		
		String format =  new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(data);
		System.out.println("Data Formatada em getFormate: "+format);
		return format;
	}
	
	public static String getFormated(Date data){
		
		if(data==null)
			return null;
		
		String format =  new SimpleDateFormat("dd/MM/yyyy").format(data);
		System.out.println("Data Formatada em getFormate: "+format);
		return format;
	}

}

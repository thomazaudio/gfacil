package lead;
import java.io.IOException;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.google.gson.Gson;
import model.GenericService;

@Service
public class  LeadService extends GenericService<Lead>   {

	private String listId = "32180";
	private String apiKey = "Basic dGhvbWF6YXVkaW86bGVnaGFjeTEyMw==";

	@Autowired
	private LeadDAO dao;

	@Override
	public Lead addOrUpdate(Lead lead) {
		
		
		if(lead.getTransientAction()!=null){
			
			if(lead.getActions()==null)
				lead.setActions("");
			
			lead.setActions(lead.getActions()+", "+lead.getTransientAction());
		}
		
		

		try{
			//Cadastrar
			if(lead.getId()==0){

				return this.addLead(lead);
			}
			//Atualizar
			else{

				return this.updateLead(lead);
			}
		}
		catch(Exception e){

		}

		return null;
	}


	public Lead addLead(Lead lead) throws ClientProtocolException, IOException{

		
		/*
		
			Gson gson = new Gson();
			HttpClient   httpClient = new DefaultHttpClient();
			HttpPost httppost = new HttpPost("https://rest.clicksend.com/v3/lists/"+this.listId+"/contacts");
			httppost.setHeader("Content-Type","application/json");
			httppost.setHeader("Authorization", apiKey);
			httppost.setEntity(new StringEntity(gson.toJson(lead)));
			HttpResponse res = httpClient.execute(httppost);
			String json_string = EntityUtils.toString(res.getEntity());
			JSONObject jsonRes = new JSONObject(json_string);
	
			Long contact_id = jsonRes.getJSONObject("data").getLong("contact_id");
	
			lead.setContact_id(contact_id);
	    
*/
		return  dao.addOrUpdate(lead);

	}


	public Lead updateLead(Lead lead) throws ClientProtocolException, IOException{

		
		/*
			Gson gson = new Gson();
			HttpClient   httpClient = new DefaultHttpClient();
			HttpPut httpput = new HttpPut("https://rest.clicksend.com/v3/lists/"+this.listId+"/contacts/"+lead.getContact_id());
			httpput.setHeader("Content-Type","application/json");
			httpput.setHeader("Authorization", apiKey);
			httpput.setEntity(new StringEntity(gson.toJson(lead)));
			HttpResponse res = httpClient.execute(httpput);
			String json_string = EntityUtils.toString(res.getEntity());
			JSONObject jsonRes = new JSONObject(json_string);
	
			Long contact_id = jsonRes.getJSONObject("data").getLong("contact_id");
	
			lead.setContact_id(contact_id);
			
			*/
			
		
		return  dao.addOrUpdate(lead);

	}









}

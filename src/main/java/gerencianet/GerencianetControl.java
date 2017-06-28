package gerencianet;
import java.util.HashMap;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import com.fasterxml.jackson.annotation.JsonView;
import br.com.gerencianet.gnsdk.Gerencianet;
import br.com.gerencianet.gnsdk.exceptions.GerencianetException;
import movimentacao.MovimentacaoService;

@Controller
public  class GerencianetControl {
	
	@Autowired
	private MovimentacaoService movService;

	
	private Gerencianet gn = GerenciaNetUtil.getGN();
	
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/gerencianet/atualiza-pagamento/", method=RequestMethod.POST)
	public  String atualizaPagamento(@RequestBody MultiValueMap<String, String> data) throws Exception{
		
		return null;
		
	}


	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/gerencianet/processa-pagamento/", method=RequestMethod.POST)
	public  String processaPagamento(@RequestBody MultiValueMap<String, String> data) throws Exception{
		
		
		String formaPagamento = data.getFirst("payment[method]");
		
		String chargeId = this.createCharge();
		
		if(formaPagamento.equals("credit_card")){
			
			return this.pagarCartao(data, chargeId);
		}
		
		else {
			return this.PagarBoleto(data, chargeId);
		}
		

	}
	
	public String createCharge() throws Exception{

		/* ************************************************* */ 
		
		String chargeId = "";

		JSONArray items = new JSONArray();

		JSONObject item1 = new JSONObject();
		item1.put("name", "Ceasa Plus - Taxa de instalação + 1ª mensalidade");
		item1.put("amount", 1);
		item1.put("value", 85900);

		items.put(item1);
		
		JSONObject body = new JSONObject();
		body.put("items", items);
		
		try {
		   
		    JSONObject response = gn.call("createCharge", new HashMap<String,String>(), body);
		    System.out.println(response);
		    chargeId = String.valueOf(response.getJSONObject("data").getLong("charge_id"));
		}catch (GerencianetException e){
		    System.out.println(e.getCode());
		    System.out.println(e.getError());
		    System.out.println(e.getErrorDescription());
		}
		catch (Exception e) {
		    System.out.println(e.getMessage());
		}
		
		return chargeId;
	}

	public  String  PagarBoleto(MultiValueMap<String, String> data, String chargeId) throws Exception{
		HashMap<String, String> params = new HashMap<String, String>();
		
		System.out.println("chargeId: "+chargeId);
		params.put("id", chargeId);
		
		JSONObject response = null;

		JSONObject customer = new JSONObject();
		customer.put("name", "Gorbadoc Oldbuck");
		customer.put("cpf", "04267484171");
		customer.put("phone_number", "5144916523");

		JSONObject bankingBillet = new JSONObject();
		bankingBillet.put("expire_at", "2018-12-12");
		bankingBillet.put("customer", customer);

		JSONObject payment = new JSONObject();
		payment.put("banking_billet", bankingBillet);

		JSONObject body = new JSONObject();
		body.put("payment", payment);

		try {
		 
		    response = gn.call("payCharge", params, body);
		    System.out.println(response);
		}catch (GerencianetException e){
		    System.out.println(e.getCode());
		    System.out.println(e.getError());
		    System.out.println(e.getErrorDescription());
		}
		catch (Exception e) {
		    System.out.println(e.getMessage());
		}
		
		return response.toString();
	}
	
	
	public String pagarCartao(MultiValueMap<String, String> data, String chargeId) {
	
		
		HashMap<String, String> params = new HashMap<String, String>();
		params.put("id", chargeId);
		
		  JSONObject response = null;
		
		String paymentToken = data.getFirst("payment[payment_token]") ;
		
		System.out.println("paymentToken: "+paymentToken);
		System.out.println("id: "+chargeId);
		
		JSONObject customer = new JSONObject();
		customer.put("name", "Thomaz Reis Damasceno");
		customer.put("cpf", "10821017616");
		customer.put("phone_number", "31992267947");
		customer.put("email", "thomaz-guitar@hotmail.com");
		customer.put("birth", "1977-01-15");
		
		JSONObject billingAddress = new JSONObject();
		billingAddress.put("street", "Av Tancredo Neves");
		billingAddress.put("number", 89);
		billingAddress.put("neighborhood", "Centro");
		billingAddress.put("zipcode", "35473000");
		billingAddress.put("city", "Belo Vale");
		billingAddress.put("state", "MG");
		
		JSONObject creditCard = new JSONObject();
		creditCard.put("installments", 1);
		creditCard.put("billing_address", billingAddress);
		creditCard.put("payment_token", paymentToken);
		creditCard.put("customer", customer);

		JSONObject payment = new JSONObject();
		payment.put("credit_card", creditCard);

		JSONObject body = new JSONObject();
		body.put("payment", payment);

		try {
		    response = gn.call("payCharge", params, body);
		    System.out.println(response);
		}catch (GerencianetException e){
		    System.out.println(e.getCode());
		    System.out.println(e.getError());
		    System.out.println(e.getErrorDescription());
		}
		catch (Exception e) {
		    System.out.println(e.getMessage());
		}
		
		return response.toString();
	}



}

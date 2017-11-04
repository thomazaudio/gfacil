package transactional;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import produto.Produto;
import util.AjaxResponse;

import com.fasterxml.jackson.annotation.JsonView;

@Controller
public class TransactionController {
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/transaction", method=RequestMethod.GET)
    public String teste(){
	

        return "OK";
		
	}

}

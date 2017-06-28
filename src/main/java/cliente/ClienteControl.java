package cliente;

import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.fasterxml.jackson.annotation.JsonView;
import model.GenericControl;
import util.AjaxResponse;

@Controller
@Service
@Secured("IS_AUTHENTICATED_FULLY")
public class ClienteControl  extends GenericControl<Cliente>{
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/cliente/add/", method= RequestMethod.POST)
	public AjaxResponse<Cliente> addOrUpdate(@RequestBody Cliente item) {
  
		 return addOrUpdateAndRespond(item);
     
	}

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/cliente", method= RequestMethod.GET)
	public AjaxResponse<Cliente> getAll() {
		

		
	 return	getAllAndRespond();
	 
	}
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/cliente/get", method= RequestMethod.GET)
	public AjaxResponse<Cliente> getById(@RequestParam Long id) {
		
		return getByIdAndRespond(id);
	}

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/cliente/b", method= RequestMethod.GET)
	public AjaxResponse<Cliente> getLike(@RequestParam String propriedade,@RequestParam String query) {
		
		return getLikeAndRespond(propriedade, query);
	}
	
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/cliente/busca/map", method= RequestMethod.GET)
	public AjaxResponse<Cliente> getLikeMap(@RequestParam String[] qs,@RequestParam int pagina,@RequestParam int max,@RequestParam String extra) {
		
		
		System.out.println("Extra aqui: "+extra);
		System.out.println("Querys aqui");
		for(String q :qs){
			System.out.println(q);
			
		}
		
		
		return getLikeMapAndRespond(qs, pagina, max,extra);
	}

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/cliente/delete/", method= RequestMethod.POST)
	public AjaxResponse<Cliente> delete(@RequestBody long[] ids) {
	
		return deleteByIdAndRespond(ids);
	}

}

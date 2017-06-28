package funcionario;

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
public class FuncionarioControl  extends GenericControl<Funcionario>{
	
	
	

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/funcionario/add/", method= RequestMethod.POST)
	public AjaxResponse<Funcionario> addOrUpdate(@RequestBody Funcionario item) {
  
		 return addOrUpdateAndRespond(item);
     
	}

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/funcionario", method= RequestMethod.GET)
	public AjaxResponse<Funcionario> getAll() {
		
	 return	getAllAndRespond();
	 
	}
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/funcionario/get", method= RequestMethod.GET)
	public AjaxResponse<Funcionario> getById(@RequestParam Long id) {
		
		return getByIdAndRespond(id);
	}

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/funcionario/b", method= RequestMethod.GET)
	public AjaxResponse<Funcionario> getLike(@RequestParam String propriedade,@RequestParam String query) {
		
		return getLikeAndRespond(propriedade, query);
	}
	
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/funcionario/busca/map", method= RequestMethod.GET)
	public AjaxResponse<Funcionario> getLikeMap(@RequestParam String[] qs,@RequestParam int pagina,@RequestParam int max,@RequestParam String extra) {
		
		
		System.out.println("Query no controller: "+qs);
		
		return getLikeMapAndRespond(qs, pagina, max,extra);
	}

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/funcionario/delete/", method= RequestMethod.POST)
	public AjaxResponse<Funcionario> delete(@RequestBody long[] ids) {
	
		return deleteByIdAndRespond(ids);
	}

}

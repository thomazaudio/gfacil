package fornecedor;

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
public class FornecedorControl  extends GenericControl<Fornecedor>{

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/fornecedor/add/", method= RequestMethod.POST)
	public AjaxResponse<Fornecedor> addOrUpdate(@RequestBody Fornecedor item) {
  
		 return addOrUpdateAndRespond(item);
     
	}

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/fornecedor", method= RequestMethod.GET)
	public AjaxResponse<Fornecedor> getAll() {
		
	 return	getAllAndRespond();
	 
	}
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/fornecedor/get", method= RequestMethod.GET)
	public AjaxResponse<Fornecedor> getById(@RequestParam Long id) {
		
		return getByIdAndRespond(id);
	}

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/fornecedor/b", method= RequestMethod.GET)
	public AjaxResponse<Fornecedor> getLike(@RequestParam String propriedade,@RequestParam String query) {
		
		return getLikeAndRespond(propriedade, query);
	}
	
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/fornecedor/busca/map", method= RequestMethod.GET)
	public AjaxResponse<Fornecedor> getLikeMap(@RequestParam String[] qs,@RequestParam int pagina,@RequestParam int max,@RequestParam String extra) {
		
		return getLikeMapAndRespond(qs, pagina, max,extra);
	}

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/fornecedor/delete/", method= RequestMethod.POST)
	public AjaxResponse<Fornecedor> delete(@RequestBody long[] ids) {
	
		return deleteByIdAndRespond(ids);
	}

}

package operadorsistema;

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
public class OperadorSistemaControl  extends GenericControl<OperadorSistema>{
	
	
	
	

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/operadorsistema/add/", method= RequestMethod.POST)
	public AjaxResponse<OperadorSistema> addOrUpdate(@RequestBody OperadorSistema item) {
  
		 return addOrUpdateAndRespond(item);
     
	}

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/operadorsistema", method= RequestMethod.GET)
	public AjaxResponse<OperadorSistema> getAll() {
		
	 return	getAllAndRespond();
	 
	}
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/operadorsistema/get", method= RequestMethod.GET)
	public AjaxResponse<OperadorSistema> getById(@RequestParam Long id) {
		
		return getByIdAndRespond(id);
	}

	
	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/operadorsistema/busca/map", method= RequestMethod.GET)
	public AjaxResponse<OperadorSistema> getLikeMap(@RequestParam String[] qs,@RequestParam int pagina,@RequestParam int max,@RequestParam String extra) {
		
		
		System.out.println("Query no controller: "+qs);
		
		return getLikeMapAndRespond(qs, pagina, max,extra);
	}

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/operadorsistema/delete/", method= RequestMethod.POST)
	public AjaxResponse<OperadorSistema> delete(@RequestBody long[] ids) {
	
		return deleteByIdAndRespond(ids);
	}

	@Override
	public AjaxResponse<OperadorSistema> getLike(String propriedade, String query) {
		// TODO Auto-generated method stub
		return null;
	}

}

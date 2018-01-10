package carregador;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.fasterxml.jackson.annotation.JsonView;
import model.GenericControl;
import util.AjaxResponse;

@Controller
@Secured("IS_AUTHENTICATED_FULLY")
public class CarregadorControl extends GenericControl<Carregador> {
	
	
	@Autowired
	private CarregadorService carregadorService;
	
	
	
	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/carregador/add/", method=RequestMethod.POST)
    public AjaxResponse<Carregador> addOrUpdate(@RequestBody Carregador item){
		
		return addOrUpdateAndRespond(item);
	}
	
	@Override
	@RequestMapping(value="/carregador", method=RequestMethod.GET)
	@JsonView(util.Views.Public.class)
	@ResponseBody
    public AjaxResponse<Carregador> getAll(){
		
		return this.getAllAndRespond();

	}
	
	//Por id
	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/carregador/get", method= RequestMethod.GET)
	public AjaxResponse<Carregador> getById(@RequestParam Long id){
		
		
		return getByIdAndRespond(id);
   	
	}
	
	//Atrav�s de uma busca
	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/carregador/busca", method= RequestMethod.GET)
	public AjaxResponse<Carregador> getLike(@RequestParam String propriedade,@RequestParam String query){
		
		return getLikeAndRespond(propriedade,query);
		
	}
	
	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/carregador/delete/", method=RequestMethod.POST)
    public AjaxResponse<Carregador> delete(@RequestBody long[] ids){
		
		
		
		carregadorService.deleteByIds(ids);
		
		return getAllAndRespond();
		
		
	}


	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/carregador/busca/map", method= RequestMethod.GET)
	public AjaxResponse<Carregador> getLikeMap(@RequestParam String[] qs,@RequestParam int pagina,@RequestParam int max,@RequestParam String extra) {
		
		return getLikeMapAndRespond(qs, pagina, max, extra);
	}
	
	
}

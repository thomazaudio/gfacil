package entradamercadoria;
import model.GenericControl;
import util.AjaxResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.annotation.JsonView;


@Controller
public class EntradaMercadoriaControl extends GenericControl<EntradaMercadoria> {
	
	
	@Autowired
	private EntradaMercadoriaService emService;
	
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/entradamercadoria/add/", method=RequestMethod.POST)
	public AjaxResponse<EntradaMercadoria> addOrUpdate(@RequestBody EntradaMercadoria item) {
		
		return addOrUpdateAndRespond(item);
	}

	@Override
	public AjaxResponse<EntradaMercadoria> getAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/entradamercadoria/get", method= RequestMethod.GET)
	public AjaxResponse<EntradaMercadoria> getById(@RequestParam Long id) {
		
		
		return getByIdAndRespond(id);
	}

	@Override
	public AjaxResponse<EntradaMercadoria> getLike(String propriedade, String query) {
		// TODO Auto-generated method stub
		return null;
	}
	
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/entradamercadoria/delete/", method=RequestMethod.POST)
	public AjaxResponse<EntradaMercadoria> deleteEM(@RequestBody EntradaMercadoria em) {
		
		
		emService.deletarEM(em);
		
		return null;
	}

	@Override
	public AjaxResponse<EntradaMercadoria> delete(long[] ids) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/entradamercadoria/busca/map", method=RequestMethod.GET)
	public AjaxResponse<EntradaMercadoria> getLikeMap(@RequestParam String[] qs,@RequestParam int pagina,@RequestParam int max,@RequestParam String extra) {
		
		
		return getLikeMapAndRespond(qs, pagina, max, extra);
	}

	

}

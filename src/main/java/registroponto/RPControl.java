
package registroponto;
import java.util.Date;
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
public class RPControl  extends GenericControl<RP>{
	
	
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/registroponto/abrir-ponto/", method=RequestMethod.POST)
	public AjaxResponse<RP> abrirPonto(@RequestBody RP item) {
		
		item.setDataInicio(new Date());
		item.setDataFim(null);
		
		return addOrUpdateAndRespond(item);
	}
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/registroponto/fechar-ponto/", method=RequestMethod.POST)
	public AjaxResponse<RP> fecharPonto(@RequestBody RP item) {
		
		item.setDataFim(new Date());
		
		return addOrUpdateAndRespond(item);
	}
	

	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/registroponto/add/", method=RequestMethod.POST)
	public AjaxResponse<RP> addOrUpdate(@RequestBody RP item) {
		
		return addOrUpdateAndRespond(item);
	}

	@Override
	public AjaxResponse<RP> getAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<RP> getById(Long id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<RP> getLike(String propriedade, String query) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/registroponto/delete/", method=RequestMethod.POST)
	public AjaxResponse<RP> delete(@RequestBody long[] ids) {
		
		return deleteByIdAndRespond(ids);
	}

	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/registroponto/busca/map", method=RequestMethod.GET)
	public AjaxResponse<RP> getLikeMap(@RequestParam String[] qs,@RequestParam int pagina,@RequestParam int max,@RequestParam String extra) {
		
		return getLikeMapAndRespond(qs, pagina, max, extra);
	}

}
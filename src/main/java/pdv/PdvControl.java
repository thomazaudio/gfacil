package pdv;
import model.GenericControl;
import util.AjaxResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.fasterxml.jackson.annotation.JsonView;


@Controller
@Secured("IS_AUTHENTICATED_FULLY")
public class PdvControl extends GenericControl<Pdv> {

	@Autowired
	private PdvService pdvService;
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/pdv/save-retirou", method=RequestMethod.GET)
	public AjaxResponse<Pdv> saveRetirouMercadoria(@RequestParam long idPdv, @RequestParam int carregado) {

		pdvService.changeAttr(idPdv,"carregado","carregado="+carregado);

		return null;
	}


	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/pdv/add", method=RequestMethod.POST)
	public AjaxResponse<Pdv> addOrUpdate(@RequestBody Pdv item) {
		
		return addOrUpdateAndRespond(item);
	}

	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/pdv", method=RequestMethod.GET)
	public AjaxResponse<Pdv> getAll() {

		return getAllAndRespond();
	}

	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/pdv/get", method=RequestMethod.GET)
	public AjaxResponse<Pdv> getById(@RequestParam Long id) {

		return getByIdAndRespond(id);
	}

	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/pdv/busca", method=RequestMethod.GET)
	public AjaxResponse<Pdv> getLike(@RequestParam String propriedade,@RequestParam String query) {
		return getLikeAndRespond(propriedade, query);
	}


	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/pdv/delete/", method=RequestMethod.POST)
	public AjaxResponse<Pdv> delete(@RequestBody Pdv pdv) {

		pdvService.deletePdv(pdv);
		return null;
	}

	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/pdv/busca/map", method=RequestMethod.GET)
	public AjaxResponse<Pdv> getLikeMap(@RequestParam String[] qs,@RequestParam int pagina,@RequestParam int max,@RequestParam String extra) {

		return getLikeMapAndRespond(qs, pagina, max, extra);
	}

	@Override
	public AjaxResponse<Pdv> delete(long[] ids) {
		// TODO Auto-generated method stub
		return null;
	}

}

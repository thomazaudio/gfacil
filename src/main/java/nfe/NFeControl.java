package nfe;
import model.GenericControl;
import util.AjaxResponse;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.fasterxml.jackson.annotation.JsonView;



@Controller
public class NFeControl extends GenericControl<NFe> {


	@Autowired
	NFeService nfeService;
	
	@Autowired
	GrupoImpostoService grupoImpostoService;
	
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/nfe/valida-nfe/", method= RequestMethod.POST)
	public ArrayList<NFeErro> validaNFe(@RequestBody NFe nfe) {
		
	    return null;
	    		//NFeUtil.validaNFe(nfe.getInfNFe());
		
	}
	
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/nfe/add/", method= RequestMethod.POST)
	@Override
	public AjaxResponse<NFe> addOrUpdate(@RequestBody NFe nfe) {
		
		return addOrUpdateAndRespond(nfe);
	}
	
	
	//Listagem de grupos de impostos
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/grupoimposto", method= RequestMethod.GET)
	public AjaxResponse<GrupoImposto> getAllGrupoImposto() {
		
		AjaxResponse<GrupoImposto> res = new AjaxResponse<GrupoImposto>();
		res.setItens(grupoImpostoService.getAll());
		return res;
	}
	
	
	    //Adicionar ou editar um grupo de impostos
		@JsonView(util.Views.Public.class)
		@ResponseBody
		@RequestMapping(value="/grupoimposto/add/", method= RequestMethod.POST)
		public AjaxResponse<GrupoImposto> addGrupoImposto(@RequestBody GrupoImposto imposto) {
			
			AjaxResponse<GrupoImposto> res = new AjaxResponse<GrupoImposto>();
			res.setItem(grupoImpostoService.addOrUpdate(imposto));
			return res;
		}





	@Override
	public AjaxResponse<NFe> getAll() {
		// TODO Auto-generated method stub
		return null;
	}



	@Override
	public AjaxResponse<NFe> getLike(String propriedade, String query) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<NFe> delete(long[] ids) {
		// TODO Auto-generated method stub
		return null;
	}

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/nfe/busca/map", method= RequestMethod.GET)
	public AjaxResponse<NFe> getLikeMap(@RequestParam String[] qs,@RequestParam int pagina,@RequestParam int max,@RequestParam String extra) {


		return getLikeMapAndRespond(qs, pagina, max, extra);
	}

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/nfe/get", method= RequestMethod.GET)
	public AjaxResponse<NFe> getById(@RequestParam Long id) {
		
	
		return getByIdAndRespond(id);
	}





	
	


}

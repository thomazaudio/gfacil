package estadoscidades;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.annotation.JsonView;

import util.AjaxResponse;

@Controller
public class EstadosCidadesController {
	
	@Autowired
	private EstadoService estadoService;
	
	
	@Autowired
	private CidadeService cidadeService;
	
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/estadoscidades/get-estado", method= RequestMethod.GET)
	public AjaxResponse<Estado> getEstadoByUf(@RequestParam String uf){
		
		AjaxResponse<Estado> res = new AjaxResponse<Estado>();
		res.setItem( estadoService.getEstadoByUf(uf));
		return res;
		
	}
	

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/estadoscidades/get-estados", method= RequestMethod.GET)
	public AjaxResponse<Estado> getAllEstados(){
		
		AjaxResponse<Estado> estados = new AjaxResponse<Estado>();
		estados.setItens( estadoService.getAll());
		return estados;
		
	}
	
	
	//Recupera um cidade através do código do municipio
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/estadoscidades/get-cidade", method= RequestMethod.GET)
	public AjaxResponse<Cidade> getByCodMun(@RequestParam long codMun){
		
		AjaxResponse<Cidade> res = new AjaxResponse<Cidade>();
		res.setItem( cidadeService.getByCodMun(codMun));
		return res;
		
	}
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/estadoscidades/get-cidades", method= RequestMethod.GET)
	public AjaxResponse<Cidade> getCidadeByUf(@RequestParam String uf){
		
		AjaxResponse<Cidade> estados = new AjaxResponse<Cidade>();
		estados.setItens( cidadeService.getAllByUf(uf));
		return estados;
		
	}
} 

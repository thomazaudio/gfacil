package movimentacao;
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
public class MovimentacaoControl extends GenericControl<Movimentacao> {

	@Autowired
	private MovimentacaoService movService;
	
	public MovimentacaoService getMovService() {
		return movService;
	}


	public void setMovService(MovimentacaoService movService) {
		this.movService = movService;
	}
	
	
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/movimentacao/add-parcelas/", method=RequestMethod.POST)
	public AjaxResponse<Movimentacao> addOrUpdate(@RequestBody  Movimentacao[] movs) {
		
		  AjaxResponse<Movimentacao> res = new AjaxResponse<Movimentacao>();
		  res.setItem(movService.addParcelas(movs));
		  return res;
	}
	
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/movimentacao/get-parcelas", method=RequestMethod.GET)
	public AjaxResponse<Movimentacao> getParcelas(@RequestParam long idOriginalMov) {
		
		AjaxResponse<Movimentacao> res = new AjaxResponse<Movimentacao>();
		res.setItens(movService.getParcelas(idOriginalMov));
		return res;
		
		 
	}
	
	



	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/movimentacao/add/", method=RequestMethod.POST)
	public AjaxResponse<Movimentacao> addOrUpdate(@RequestBody Movimentacao mov) {
		
		 return addOrUpdateAndRespond(mov);
	}
	
	

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/movimentacao", method=RequestMethod.GET)
	public AjaxResponse<Movimentacao> getAll() {
		
		return getAllAndRespond();
	}

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/movimentacao/get", method=RequestMethod.GET)
	public AjaxResponse<Movimentacao> getById(@RequestParam Long id) {
		
		return getByIdAndRespond(id);
	}

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/movimentacao/busca", method=RequestMethod.GET)
	public AjaxResponse<Movimentacao> getLike(@RequestParam String propriedade,@RequestParam String query) {
		
		return getLikeAndRespond(propriedade, query);
	}
	
	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/movimentacao/busca/map", method=RequestMethod.GET)
	public AjaxResponse<Movimentacao> getLikeMap(@RequestParam String[] qs,@RequestParam int pagina,@RequestParam int max,@RequestParam String extra) {
		
		 AjaxResponse<Movimentacao> res  = new  AjaxResponse<Movimentacao>();
		 
		 res.setItens(movService.getLikeMap(qs, pagina, max, extra));
		
		 return res;
	}
	
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/movimentacao/delete/", method=RequestMethod.POST)
	public AjaxResponse<Movimentacao> delete(@RequestBody ObjectAltMov alt) {
		
       movService.deleteMov(alt.getMov(),alt.getModo());
       return null;
		
	}


	@Override
	public AjaxResponse<Movimentacao> delete(long[] ids) {
		// TODO Auto-generated method stub
		return null;
	}



}

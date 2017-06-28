package produto;
import org.springframework.beans.factory.annotation.Autowired;
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
public class ProdutoControl extends GenericControl<Produto> {
	
	
	@Autowired
	private ProdutoService produtoService;
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/produto/min-estoque", method=RequestMethod.GET)
    public AjaxResponse<Produto> getProdutosMinEstoque(){
	
		AjaxResponse<Produto> res =   new AjaxResponse<Produto>();
		
		res.setItens(produtoService.getProdutosMinEstoque());
		
		return res;
		
	}
	
	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/produto/add/", method=RequestMethod.POST)
    public AjaxResponse<Produto> addOrUpdate(@RequestBody Produto prod){
		
		return addOrUpdateAndRespond(prod);
	}
	
	@Override
	@RequestMapping(value="/produto", method=RequestMethod.GET)
	@JsonView(util.Views.Public.class)
	@ResponseBody
    public AjaxResponse<Produto> getAll(){
		
		return this.getAllAndRespond();

	}
	
	//Por id
	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/produto/get", method= RequestMethod.GET)
	public AjaxResponse<Produto> getById(@RequestParam Long id){
		
		
		return getByIdAndRespond(id);
   	
	}
	
	//Atrav�s de uma busca
	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/produto/busca", method= RequestMethod.GET)
	public AjaxResponse<Produto> getLike(@RequestParam String propriedade,@RequestParam String query){
		
		return getLikeAndRespond(propriedade,query);
		
	}
	
	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/produto/delete/", method=RequestMethod.POST)
    public AjaxResponse<Produto> delete(@RequestBody long[] ids){
		
		ProdutoService service = (ProdutoService) getService();
		
		service.deleteByIds(ids);
		
		return getAllAndRespond();
		
		
	}


	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/produto/busca/map", method= RequestMethod.GET)
	public AjaxResponse<Produto> getLikeMap(@RequestParam String[] qs,@RequestParam int pagina,@RequestParam int max,@RequestParam String extra) {
		
		return getLikeMapAndRespond(qs, pagina, max, extra);
	}
	
	
}

package pedido;
import java.util.Map;
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
import produto.ProdutoService;
import util.AjaxResponse;


@Controller
@Service
@Secured("IS_AUTHENTICATED_FULLY")
public class PedidoControl extends GenericControl<Pedido> {
	
	   
	
		@Autowired
		private PedidoService pedidoService;
	
		public PedidoService getPedidoService() {
			return pedidoService;
		}
	
		public void setPedidoService(PedidoService pedidoService) {
			this.pedidoService = pedidoService;
		}
		
		@Autowired
		private ProdutoService produtoService;


		
	
		public ProdutoService getProdutoService() {
			return produtoService;
		}

		public void setProdutoService(ProdutoService produtoService) {
			this.produtoService = produtoService;
		}
		
		
		
		@JsonView(util.Views.Public.class)
		@ResponseBody
		@RequestMapping(value="/pedido/projecoes", method= RequestMethod.GET)
		public AjaxResponse<Map<String,Object>> getProjecoes (@RequestParam String[] qs,@RequestParam String extra,@RequestParam String columns,@RequestParam String groupBy){
			
			AjaxResponse<Map<String,Object>> res =  new AjaxResponse<Map<String,Object>>();
			res.setItens(pedidoService.getProjecoes(qs,extra, columns, groupBy));
			return res;
		}
		
		
		@Override
		@JsonView(util.Views.Public.class)
		@ResponseBody
		@RequestMapping(value="/pedido/add/", method= RequestMethod.POST)
		public AjaxResponse<Pedido> addOrUpdate(@RequestBody Pedido item) {
			
			return addOrUpdateAndRespond(item);
		}
		

		

	
		

		@JsonView(util.Views.Public.class)
		@ResponseBody
		@RequestMapping(value="/pedido/decrementa-quantidade/", method= RequestMethod.POST)
		public AjaxResponse<Pedido> addOrUpdate(@RequestBody long idPedido) {
			
			Pedido p =  pedidoService.getById(idPedido);
			
			p.setQuantidade(p.getQuantidade()-1);
			
			return updateAndRespond(p);
		}

		@Override
		public AjaxResponse<Pedido> getAll() {
			// TODO Auto-generated method stub
			return null;
		}

		@Override
		@JsonView(util.Views.Public.class)
		@ResponseBody
		@RequestMapping(value="/pedido/get", method= RequestMethod.GET)
		public AjaxResponse<Pedido> getById(Long id) {
			
			return this.getByIdAndRespond(id);
		}

		@Override
		public AjaxResponse<Pedido> getLike(String query, String propiedade) {
			// TODO Auto-generated method stub
			return null;
		}

		
		@Override
		@JsonView(util.Views.Public.class)
		@ResponseBody
		@RequestMapping(value="/pedido/delete/", method= RequestMethod.POST)
		public AjaxResponse<Pedido> delete(@RequestBody long[] ids) {
			
			AjaxResponse<Pedido> res  =  new AjaxResponse<Pedido>();
			pedidoService.deleteByIds(ids);
			
			return res;
			
		}

		
		@Override
		@JsonView(util.Views.Public.class)
		@ResponseBody
		@RequestMapping(value="/pedido/busca/map", method= RequestMethod.GET)
		public AjaxResponse<Pedido> getLikeMap(@RequestParam String[] qs,@RequestParam int pagina,@RequestParam int max,@RequestParam String extra) {
			
			return getLikeMapAndRespond(qs, pagina, max, extra);
		}

		
	

}

package pdv;
import model.GenericControl;
import movimentacao.Movimentacao;
import movimentacao.MovimentacaoService;
import pedido.Pedido;
import pedido.PedidoUtil;
import util.AjaxResponse;
import util.DataUtil;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.apache.commons.lang.ArrayUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.fasterxml.jackson.annotation.JsonView;
import logisticareversa.LogisticaReversa;
import logisticareversa.LogisticaReversaService;


@Controller
@Secured("IS_AUTHENTICATED_FULLY")
public class PdvControl extends GenericControl<Pdv> {

	@Autowired
	private LogisticaReversaService lrService;

	@Autowired
	private MovimentacaoService movService;

	@Autowired
	private PdvService pdvService;

	//Empréstimo de caixas
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/pdv/save-emprestimoembalagem", method=RequestMethod.GET)
	public AjaxResponse<Pdv> saveEmprestimoCaixa(@RequestParam long idPdv, @RequestParam int quantidade) {


		Pdv  item = pdvService.getById(idPdv);

		
		//Lr do PDV
		LogisticaReversa  lr = item.getLr();
		
		if(lr==null){
			lr = new LogisticaReversa();
			lr.setDataCadastro(DataUtil.getFormated(new Date()));

		}

		lr.setQuantidade(quantidade);
		lr.setPessoa(item.getMovimentacao().getPessoa());
		lr.setTipo(LogisticaReversa.TIPO_SAIDA);
		lrService.addOrUpdate(lr);
		
		item.setLr(lr);

      return addOrUpdateAndRespond(item);
	}

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/pdv/save-retirou", method=RequestMethod.GET)
	public AjaxResponse<Pdv> saveRetirouMercadoria(@RequestParam long idPdv, @RequestParam int carregado) {

		pdvService.changeAttr(idPdv,"carregado","carregado="+carregado);

		return null;
	}

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/pdv/save-pagou", method=RequestMethod.GET)
	public AjaxResponse<Movimentacao> savePagou(@RequestParam long idPdv, @RequestParam boolean pagou) {

		Movimentacao mov  = pdvService.getById(idPdv).getMovimentacao();
		mov.setBaixada(pagou);
		mov.setDataBaixa(DataUtil.getFormated(new Date()));
	    mov.setValor(new PedidoUtil().getTotalPedidos(mov.getPedidos()));
		
		AjaxResponse<Movimentacao> res = new AjaxResponse<Movimentacao>();
		res.setItem(movService.addOrUpdate(mov));

		return res;

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

		pdv.getMovimentacao().setValor(0);
		pdv.setDisable(1);
		List<Pedido> pedidos = pdv.getMovimentacao().getPedidos();

		ArrayList<Long> idsLr = new ArrayList<Long>();
		
		if(pdv.getLr()!=null)
		   idsLr.add(pdv.getLr().getId());

		for(int i=0;i<pedidos.size();i++){
			pedidos.get(i).setQuantidade(0);

		}

		//Apaga itens de logistica reversa na venda (Se houver)
		lrService.deleteByIds(ArrayUtils.toPrimitive(idsLr.toArray(new Long[idsLr.size()])));

		pdv.getMovimentacao().setPedidos(pedidos);

		pdv.getMovimentacao().setDisable(1);
		movService.addOrUpdate(pdv.getMovimentacao());

		long[] ids = {pdv.getId()};

		deleteByIdAndRespond(ids);

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

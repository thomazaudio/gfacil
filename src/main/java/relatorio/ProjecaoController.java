package relatorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.fasterxml.jackson.annotation.JsonView;
import java.util.Map;


import model.GenericControl;
import opcao.OpcaoService;
import util.AjaxResponse;

@Controller
@Service
//@Secured("IS_AUTHENTICATED_FULLY")
public class ProjecaoController extends GenericControl<Projecao> {
	
	@Autowired
	private OpcaoService opService;
	
	public OpcaoService getOpService() {
		return opService;
	}

	public void setOpService(OpcaoService opService) {
		this.opService = opService;
	}


	@Autowired
	private ProjecaoService projService;
	
	public ProjecaoService getProjService() {
		return projService;
	}

	public void setProjService(ProjecaoService projService) {
		this.projService = projService;
	}
	
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/projecao/execute-query", method= RequestMethod.GET)
	public AjaxResponse<Map<String,Object>> getProjecoes (@RequestParam String query){
		
	
		AjaxResponse<Map<String,Object>> res =  new AjaxResponse<Map<String,Object>>();
		res.setItens(projService.executeQuery(query));
		return res;
	}

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/projecao/get-projecoes/", method= RequestMethod.POST)
	public AjaxResponse<Map<String,Object>> getProjecoes (@RequestBody ProjecaoRequest req){
		
		AjaxResponse<Map<String,Object>> res =  new AjaxResponse<Map<String,Object>>();
		res.setItens(projService.getProjecoes(req.getObjeto(), req.getQs(),req.getExtra(), req.getColumns(),req.getGroupBy(),req.getMax()));
		return res;
	}
	
	
	public String getNameMonth(int n){
		
		
		
		switch(n){
		
		case 1:return "Janeiro";
		case 2:return "Fevereiro";
		case 3:return "Mar�o";
		case 4:return "Abril";
		case 5:return "Maio";
		case 6:return "Junho";
		case 7:return "Julho";
		case 8:return "Agosto";
		case 9:return "Setembro";
		case 10:return "Outubro";
		case 11:return "Novembro";
		case 12:return "Dezembro";
		
		}
		
		return "";
		
	}

	@Override
	public AjaxResponse<Projecao> addOrUpdate(Projecao item) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<Projecao> getAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<Projecao> getById(Long id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<Projecao> getLike(String propriedade, String query) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<Projecao> delete(long[] ids) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<Projecao> getLikeMap(String[] qs, int pagina, int max, String extra) {
		// TODO Auto-generated method stub
		return null;
	}
	
}

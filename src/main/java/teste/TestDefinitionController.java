package teste;
import model.GenericControl;
import produto.ProdutoService;
import system.SystemUtil;
import util.AjaxResponse;

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

@Controller
@Service
@Secured("IS_AUTHENTICATED_FULLY")
public class TestDefinitionController extends GenericControl<TestDefinition> {
	
	
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/testdefinition/add/", method=RequestMethod.POST)
	public AjaxResponse<TestDefinition> addDef(@RequestBody TestDefinition teste) {
		
		return addOrUpdateAndRespond(teste);
	}

	

	

	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/testdefinition/busca/map", method=RequestMethod.GET)
	public AjaxResponse<TestDefinition> getLikeMap(@RequestParam String[] qs, @RequestParam  int pagina, @RequestParam  int max, @RequestParam  String extra) {
		
		return getLikeMapAndRespond(qs, pagina, max, extra);
	}





	@Override
	public AjaxResponse<TestDefinition> addOrUpdate(TestDefinition item) {
		// TODO Auto-generated method stub
		return null;
	}





	@Override
	public AjaxResponse<TestDefinition> getAll() {
		// TODO Auto-generated method stub
		return null;
	}





	@Override
	public AjaxResponse<TestDefinition> getById(Long id) {
		// TODO Auto-generated method stub
		return null;
	}





	@Override
	public AjaxResponse<TestDefinition> getLike(String propriedade, String query) {
		// TODO Auto-generated method stub
		return null;
	}





	@Override
	public AjaxResponse<TestDefinition> delete(long[] ids) {
		// TODO Auto-generated method stub
		return null;
	}
	
	
	
	

	



}

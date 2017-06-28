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
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.annotation.JsonView;

@Controller
@Service
@Secured("IS_AUTHENTICATED_FULLY")
public class TestUserController extends GenericControl<TestUser> {
	
	@Autowired
	private TestUserService testUserService;
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/testuser/add/", method=RequestMethod.POST)
	public AjaxResponse<TestUser> addTest(@RequestBody TestUser teste) {
		
		AjaxResponse<TestUser> res = new AjaxResponse<TestUser>();
		res.setItem(testUserService.addTeste(teste));
		
		return res;
	}
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/testuser/prox-test", method=RequestMethod.GET)
	public AjaxResponse<TestDefinition> getProxTest() {
		
		AjaxResponse<TestDefinition> res = new AjaxResponse<TestDefinition>();
		res.setItem(testUserService.getProxText());
		
		return res;
	}
	
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/testuser/total-tests-for-user", method=RequestMethod.GET)
	public AjaxResponse<Long> getTotalTestes() {
		
		AjaxResponse<Long> res = new AjaxResponse<Long>();
		res.setItem(testUserService.getTotalTestsForUser());
		
		return res;
	}
	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/testuser/saldo-for-user", method=RequestMethod.GET)
	public AjaxResponse<Double> getSaldo() {
		
		AjaxResponse<Double> res = new AjaxResponse<Double>();
		res.setItem(testUserService.getSaldoForUser());
		
		return res;
	}

	@Override
	public AjaxResponse<TestUser> addOrUpdate(TestUser item) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<TestUser> getAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<TestUser> getById(Long id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<TestUser> getLike(String propriedade, String query) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<TestUser> delete(long[] ids) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<TestUser> getLikeMap(String[] qs, int pagina, int max, String extra) {
		// TODO Auto-generated method stub
		return null;
	}

	



}

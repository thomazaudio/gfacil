package lead;
import model.GenericControl;
import util.AjaxResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import pdv.Pdv;

import com.fasterxml.jackson.annotation.JsonView;

@Controller
public class LeadControl extends GenericControl<Lead> {

	@Autowired
	private LeadService leadService;

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/lead/add/", method=RequestMethod.POST)
	public AjaxResponse<lead.Lead> adicionar(@RequestBody Lead lead){

		AjaxResponse<Lead> res = new AjaxResponse<Lead>();

		res.setItem(leadService.addOrUpdate(lead));

		return res;

	}

 
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/lead/change-attr", method=RequestMethod.GET)
	public int changeAttr(@RequestParam String attr, @RequestParam String value, @RequestParam long id){

		return leadService.changeAttr(id, attr, value);

	}



	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/lead/get-basic", method=RequestMethod.GET)
	public AjaxResponse<lead.Lead> adicionar(@RequestParam long id){

		AjaxResponse<Lead> res = new AjaxResponse<Lead>();

		res.setItem(leadService.	getBasicInfoLeadById(id));

		return res;

	}

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/lead/add-action-by-tel", method=RequestMethod.GET)
	public AjaxResponse<lead.Lead> adicionar(@RequestParam String tel, @RequestParam String action) {

		leadService.addActionByTel(tel, action);
		return null;

	}


	//Métrica de incrementacao
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/lead/add-inc-metric", method=RequestMethod.GET)
	public AjaxResponse<lead.Lead> adicionar(@RequestParam String key, @RequestParam Long value) {

		leadService.addIntMetric(key, value, true);
		return null;

	}

	//Métrica de substituição
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/lead/add-subs-metric", method=RequestMethod.GET)
	public AjaxResponse<lead.Lead> adicionarSubs(@RequestParam String key, @RequestParam Long value) {

		leadService.addIntMetric(key, value, false);
		return null;

	}




	@Override
	public AjaxResponse<lead.Lead> addOrUpdate(lead.Lead item) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<lead.Lead> getAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/lead/get", method=RequestMethod.GET)
	public AjaxResponse<lead.Lead> getById(@RequestParam Long id) {

		return getByIdAndRespond(id);
	}

	@Override
	public AjaxResponse<lead.Lead> getLike(String propriedade, String query) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<lead.Lead> delete(long[] ids) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/lead/busca/map", method=RequestMethod.GET)
	public AjaxResponse<lead.Lead> getLikeMap(@RequestParam String[] qs,@RequestParam int pagina,@RequestParam int max,@RequestParam String extra) {

		return getLikeMapAndRespond(qs,pagina,max,extra);
	}





}

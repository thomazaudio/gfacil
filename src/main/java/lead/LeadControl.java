package lead;
import model.GenericControl;
import util.AjaxResponse;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.ecwid.mailchimp.MailChimpException;
import com.fasterxml.jackson.annotation.JsonView;

@Controller
public class LeadControl extends GenericControl<Lead> {

	@Autowired
	private LeadService leadService;

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/lead/add/", method=RequestMethod.POST)
	public AjaxResponse<lead.Lead> adicionar(@RequestBody Lead lead) throws IOException, MailChimpException {
   
		AjaxResponse<Lead> res = new AjaxResponse<Lead>();
		
		res.setItem(leadService.addOrUpdate(lead));
		
		return res;
	
		
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
	public AjaxResponse<lead.Lead> getById(Long id) {
		// TODO Auto-generated method stub
		return null;
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
	public AjaxResponse<lead.Lead> getLikeMap(String[] qs, int pagina, int max, String extra) {
		// TODO Auto-generated method stub
		return null;
	}

	

	

}

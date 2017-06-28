package logisticareversa;
import model.GenericControl;
import util.AjaxResponse;

import java.util.ArrayList;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.annotation.JsonView;

@Controller
public class LogisticaReversaControl extends GenericControl<LogisticaReversa> {
	
	@ResponseBody
	@RequestMapping(value="/logisticareversa/add/all/", method=RequestMethod.POST)
	public AjaxResponse<LogisticaReversa> addOrUpdateAll(@RequestBody ArrayList<LogisticaReversa> itens) {
		
		return addOrUpdateAllAndRespond(itens);
	}

	@Override
	@ResponseBody
	@RequestMapping(value="/logisticareversa/add/", method=RequestMethod.POST)
	public AjaxResponse<LogisticaReversa> addOrUpdate(@RequestBody LogisticaReversa item) {
		
		return addOrUpdateAndRespond(item);
	}

	@Override
	public AjaxResponse<LogisticaReversa> getAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<LogisticaReversa> getById(Long id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<LogisticaReversa> getLike(String propriedade, String query) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	@ResponseBody
	@RequestMapping(value="/logisticareversa/delete/", method=RequestMethod.POST)
	public AjaxResponse<LogisticaReversa> delete(@RequestBody long[] ids) {
		
		return deleteByIdAndRespond(ids);
	}

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/logisticareversa/busca/map", method=RequestMethod.GET)
	public AjaxResponse<LogisticaReversa> getLikeMap(@RequestParam String[] qs, @RequestParam int pagina, @RequestParam int max, @RequestParam String extra) {
		
		return getLikeMapAndRespond(qs, pagina, max, extra);
	}

	

}

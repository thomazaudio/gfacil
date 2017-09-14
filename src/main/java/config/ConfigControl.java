package config;
import model.GenericControl;
import system.SystemConfig;
import util.AjaxResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import com.fasterxml.jackson.annotation.JsonView;
import config.Config;

@Controller
public class ConfigControl extends GenericControl<Config> {

	
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/config/add/", method=RequestMethod.POST)
	public AjaxResponse<Config> addOrUpdate(@RequestBody Config item) {
		
		 SystemConfig.config = item;
		
		return addOrUpdateAndRespond(item);
	}

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/config", method=RequestMethod.GET)
	public AjaxResponse<Config> getAll() {
    
		return getAllAndRespond();
	}

	@Override
	public AjaxResponse<Config> getById(Long id) {
	
		return null;
	}

	@Override
	public AjaxResponse<Config> getLike(String propriedade, String query) {
	
		return null;
	}

	@Override
	public AjaxResponse<Config> delete(long[] ids) {
		
		return null;
	}

	@Override
	public AjaxResponse<Config> getLikeMap(String[] qs, int pagina, int max, String extra) {
		
		return null;
	}

}

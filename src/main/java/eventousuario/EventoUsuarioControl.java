package eventousuario;
import model.GenericControl;
import util.AjaxResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.annotation.JsonView;


@Controller
public class EventoUsuarioControl extends GenericControl<EventoUsuario> {




	//Contabilidade de eventos ocorridos
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/eventousuario/add/", method= RequestMethod.POST)
	public AjaxResponse<EventoUsuario> addOrUpdate(@RequestBody EventoUsuario item) {
		
		
		return addOrUpdateAndRespond(item);
	}

	@Override
	public AjaxResponse<EventoUsuario> getAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<EventoUsuario> getById(Long id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<EventoUsuario> getLike(String propriedade, String query) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<EventoUsuario> delete(long[] ids) {
		// TODO Auto-generated method stub
		return null;
	}

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/eventousuario/busca/map", method=RequestMethod.GET)
	public AjaxResponse<EventoUsuario> getLikeMap(@RequestParam String[] qs,@RequestParam int pagina,@RequestParam int max,@RequestParam String extra) {


		return getLikeMapAndRespond(qs, pagina, max, extra);
	}



}

package filial;
import model.GenericControl;
import util.AjaxResponse;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.annotation.JsonView;


@Controller
public class FilialControl extends GenericControl<Filial> {


	@Autowired
	private FilialService filialService;

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/filial", method=RequestMethod.GET)
	public AjaxResponse<Filial> getAll() {

		return getAllAndRespond();

	}

	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/filial/add/", method=RequestMethod.POST)
	public AjaxResponse<Filial> addOrUpdate(@RequestBody Filial item) {

		return addOrUpdateAndRespond(item);
	}

	@Override
	public AjaxResponse<Filial> getById(Long id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<Filial> getLike(String propriedade, String query) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<Filial> delete(long[] ids) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<Filial> getLikeMap(String[] qs, int pagina, int max, String extra) {
		// TODO Auto-generated method stub
		return null;
	}


	@RequestMapping(value = "/filial/upload-certificado/", method = RequestMethod.POST)
	@ResponseBody
	@JsonView(util.Views.Public.class)
	public AjaxResponse<String> uploadCertificado(  @RequestParam(value = "file") MultipartFile file, @RequestParam(value = "senha") String senha,HttpServletRequest request) {

		AjaxResponse<String> res = new AjaxResponse<String>();

		res.setItem(filialService.uploadCertificado(file,senha));

		return	res;



	}

}

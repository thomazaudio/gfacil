package servicevenda;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.fasterxml.jackson.annotation.JsonView;
import model.GenericControl;
import pedido.PedidoService;
import util.AjaxResponse;


@Controller
@Service
@Secured("IS_AUTHENTICATED_FULLY")
public  class ServiceVendaControl extends GenericControl<ServiceVenda> {

	
	


	@Autowired
	private PedidoService pedidoService;
	
    public PedidoService getPedidoService() {
		return pedidoService;
	}

	public void setPedidoService(PedidoService pedidoService) {
		this.pedidoService = pedidoService;
	}

		


	@Autowired
	private ServiceVendaService serviceVendaService; 

	public ServiceVendaService getServiceVendaService() {
		return serviceVendaService;
	}

	public void setServiceVendaService(ServiceVendaService serviceVendaService) {
		this.serviceVendaService = serviceVendaService;
	}



	//Por id
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/service-venda/get", method= RequestMethod.GET)
	public AjaxResponse<ServiceVenda> getById(@RequestParam Long id){

		return this.getByIdAndRespond(id);

	}

	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/service-venda", method= RequestMethod.GET)
	public AjaxResponse<ServiceVenda> getAll() {

		return this.getAllAndRespond();
	}




	@Override
	@JsonView(util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/service-venda/busca", method= RequestMethod.GET)
	public AjaxResponse<ServiceVenda> getLike(@RequestParam String propriedade, @RequestParam String query) {
		
		return getLikeAndRespond(propriedade, query);
	}
	
	

	@Override
	public AjaxResponse<ServiceVenda> delete(long[] ids) {
		// TODO Auto-generated method stub
		return null;
	}


	
			@Override
			public AjaxResponse<ServiceVenda> getLikeMap(String[] qs, int pagina, int max, String extra) {
				// TODO Auto-generated method stub
				return null;
			}

			@Override
			public AjaxResponse<ServiceVenda> addOrUpdate(ServiceVenda item) {
				// TODO Auto-generated method stub
				return null;
			}	
		




}

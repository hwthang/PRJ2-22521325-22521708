import { communes } from "../core/assets/data/communes";
import { provinces } from "../core/assets/data/provinces";

class AddressHelper {
  getProvinces = () => provinces;
  getCommunesByProvince = (provinceName) => {
    const result = communes.filter((c) => c.province === provinceName);
    return result;
  };
}

export default new AddressHelper();

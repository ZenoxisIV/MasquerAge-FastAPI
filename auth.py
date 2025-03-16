from requests import Response
from mosip_auth_sdk import MOSIPAuthenticator
from mosip_auth_sdk.models import DemographicsModel
from dynaconf import Dynaconf

class AuthHandler:
    def __init__(self):
        config = Dynaconf(settings_files=["./env/config.toml"])
        self.authenticator = MOSIPAuthenticator(config=config)

    def yesno(self, uid: str, demographic_data: DemographicsModel) -> bool:
        response: Response = self.authenticator.auth(  # type: ignore
            individual_id=uid,
            individual_id_type="UIN",
            consent=True,
            demographic_data=demographic_data,
        )

        response_body: dict[str, str] = response.json()
        response_proper: dict = response_body.get("response")
        assert response_proper is not None
        final_response = response_proper.get("authStatus")
        assert final_response is not None
        return final_response


def main():
    auth = AuthHandler()
    demo: DemographicsModel = DemographicsModel(dob="1992/04/29")
    print(auth.yesno("2047631038", demo))


if __name__ == "__main__":
    main()

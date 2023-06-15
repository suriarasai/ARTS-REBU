import Page from "@/components/ui/page";
import Section from "@/components/ui/section";
import { Title } from "@/redux/types/constants";

export default function Notifications() {
	return (
		<Page title={Title.NOTIFICATIONS}>
			<Section>
				Notification
			</Section>
		</Page>
	)
}
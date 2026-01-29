export type ServiceWorkerDetail = {
  name: string;
  tel?: string;
  image_url?: string;
  vehicle?: string;
  job_type?: "delivery" | "cleaning" | "other";
};

export type Profile = {
  service_worker_detail: ServiceWorkerDetail;
  service_and_worker?: {
    services?: {
      name?: string;
    };
  }[];
};

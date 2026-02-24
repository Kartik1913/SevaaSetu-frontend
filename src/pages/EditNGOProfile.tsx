import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/config/api";
import { toast } from "sonner";

const EditNGOProfile = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    description: "",
    city: "",
    category: "",
    website: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setForm({
        firstName: data.firstName || "",
        description: data.description || "",
        city: data.city || "",
        category: data.category || "",
        website: data.website || "",
      });
    };

    fetchProfile();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/api/ngo/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message);
    } else {
      toast.success("Profile updated successfully!");
      navigate("/ngo/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow py-10">
        <div className="container mx-auto px-4 max-w-xl">
          <div className="civic-card p-6 bg-card">
            <h2 className="text-xl font-semibold mb-6">
              Edit NGO Profile
            </h2>

            <Input
              name="firstName"
              placeholder="NGO Name"
              value={form.firstName}
              onChange={handleChange}
              className="mb-4"
            />

            <Input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="mb-4"
            />

            <Input
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              className="mb-4"
            />

            <Input
              name="website"
              placeholder="Website (optional)"
              value={form.website}
              onChange={handleChange}
              className="mb-4"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full mb-6 p-3 border rounded-md"
            />

            <Button
              className="w-full bg-saffron-500 hover:bg-saffron-600 text-white"
              onClick={handleSubmit}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditNGOProfile;
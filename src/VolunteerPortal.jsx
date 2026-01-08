import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  AlertCircle,
  Edit2,
  Save,
  X
} from 'lucide-react';

const VolunteerPortal = ({ apiUrl = '' } = {}) => {
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  // Sample data structure - in production, this would sync with Google Sheets
  const sampleVolunteers = [
    {
      id: 1,
      name: "Sarah Chen",
      area: "Events Coordination",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      email: "sarah.chen@email.com",
      phone: "(530) 555-0123",
      address: "123 Pine Street, Grass Valley, CA 95945",
      birthday: "March 15",
      background:
        "Sarah has been volunteering with North Star House since 2022, bringing her event planning expertise and love for historic preservation to our community.",
      hours: 87,
      emergencyContact: "John Chen (530) 555-0124",
      notes: "Prefers morning shifts. Excellent with vendor coordination.",
      isActive: true
    },
    {
      id: 2,
      name: "Michael Torres",
      area: "Historic Preservation",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      email: "m.torres@email.com",
      phone: "(530) 555-0125",
      address: "456 Oak Avenue, Grass Valley, CA 95945",
      birthday: "July 22",
      background:
        "Retired contractor with 30+ years of experience. Passionate about preserving Julia Morgan's architectural legacy.",
      hours: 124,
      emergencyContact: "Maria Torres (530) 555-0126",
      notes: "Skilled in woodwork restoration. Available weekdays.",
      isActive: true
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      area: "Arts Programming",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      email: "emily.r@email.com",
      phone: "(530) 555-0127",
      address: "789 Maple Drive, Nevada City, CA 95959",
      birthday: "November 8",
      background:
        "Local artist and educator who teaches youth art classes at North Star House. Deeply connected to the creative community.",
      hours: 63,
      emergencyContact: "David Rodriguez (530) 555-0128",
      notes: "Great with children. Leads Saturday workshops.",
      isActive: true
    }
  ];

  useEffect(() => {
    let isMounted = true;
    let timer;

    const loadVolunteers = async () => {
      if (!apiUrl) {
        // Simulate loading from Google Sheets
        timer = setTimeout(() => {
          if (!isMounted) {
            return;
          }
          setVolunteers(sampleVolunteers);
          setLoading(false);
        }, 800);
        return;
      }

      try {
        const response = await fetch(apiUrl, { method: 'GET' });
        const data = await response.json();
        if (!isMounted) {
          return;
        }
        if (!response.ok || !data || !Array.isArray(data.volunteers)) {
          throw new Error('Failed to load volunteers.');
        }
        setVolunteers(data.volunteers);
      } catch (err) {
        if (isMounted) {
          setError('Unable to load volunteers from Google Sheets.');
          setVolunteers(sampleVolunteers);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadVolunteers();

    return () => {
      isMounted = false;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [apiUrl]);

  const filteredVolunteers = volunteers.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.area.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter((v) => (showInactive ? true : v.isActive !== false));

  const handleEdit = (volunteer) => {
    setIsEditing(true);
    setEditedData({ ...volunteer });
  };

  const handleSave = async () => {
    setError('');
    if (!editedData) {
      return;
    }

    if (!apiUrl) {
      setVolunteers(volunteers.map((v) => (v.id === editedData.id ? editedData : v)));
      setSelectedVolunteer(editedData);
      setIsEditing(false);
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteer: editedData })
      });
      const data = await response.json();
      if (!response.ok || !data || !Array.isArray(data.volunteers)) {
        throw new Error('Failed to update volunteers.');
      }
      setVolunteers(data.volunteers);
      setSelectedVolunteer(
        data.volunteers.find((v) => v.id === editedData.id) || editedData
      );
      setIsEditing(false);
    } catch (err) {
      setError('Unable to save changes to Google Sheets.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(null);
  };

  const handleInputChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const handleToggleActive = async () => {
    if (!selectedVolunteer) {
      return;
    }
    const nextActive = selectedVolunteer.isActive === false;
    const updated = { ...selectedVolunteer, isActive: nextActive };

    if (!apiUrl) {
      setVolunteers(volunteers.map((v) => (v.id === updated.id ? updated : v)));
      setSelectedVolunteer(updated);
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteer: updated })
      });
      const data = await response.json();
      if (!response.ok || !data || !Array.isArray(data.volunteers)) {
        throw new Error('Failed to update volunteer.');
      }
      setVolunteers(data.volunteers);
      setSelectedVolunteer(
        data.volunteers.find((v) => v.id === updated.id) || updated
      );
    } catch (err) {
      setError('Unable to update volunteer status.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#faf9f7' }}
      >
        <div className="text-lg" style={{ color: '#886c44' }}>
          Loading volunteers...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf9f7' }}>
      {/* Header */}
      <div className="bg-white shadow-sm" style={{ borderBottom: '1px solid #e8e6e3' }}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-light mb-2 portal-title" style={{ color: '#886c44' }}>
            Volunteer Database
          </h1>
          <p className="text-sm portal-subtitle" style={{ color: '#886c44', opacity: 0.8 }}>
            North Star House Community
          </p>
        </div>
      </div>

      {error ? (
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div
            className="rounded-lg px-4 py-3 text-sm"
            style={{ backgroundColor: '#f5f3f0', color: '#886c44', border: '1px solid #e8e6e3' }}
          >
            {error}
          </div>
        </div>
      ) : null}

      {!selectedVolunteer ? (
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Search Bar */}
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <input
              type="text"
              placeholder="Search volunteers by name or area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-3 rounded-lg focus:outline-none focus:ring-2 bg-white"
              style={{ border: '1px solid #e8e6e3', '--tw-ring-color': '#886c44' }}
            />
            <button
              type="button"
              onClick={() => setShowInactive((prev) => !prev)}
              className="px-4 py-2 rounded-lg text-sm transition-colors"
              style={{
                border: '1px solid #e8e6e3',
                color: '#886c44',
                backgroundColor: showInactive ? '#f5f3f0' : '#ffffff'
              }}
            >
              {showInactive ? 'Hide inactive' : 'Show inactive'}
            </button>
          </div>

          {/* Volunteer List */}
          <div
            className="bg-white rounded-lg shadow-sm divide-y"
            style={{ border: '1px solid #e8e6e3', borderColor: '#e8e6e3' }}
          >
            {filteredVolunteers.map((volunteer) => (
              <div
                key={volunteer.id}
                onClick={() => setSelectedVolunteer(volunteer)}
                className="flex items-center gap-4 p-4 cursor-pointer transition-colors"
                style={{ ':hover': { backgroundColor: '#f5f3f0' } }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f3f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <img
                  src={volunteer.photo}
                  alt={volunteer.name}
                  className="w-12 h-12 rounded-full object-cover"
                  style={{ border: '2px solid #886c44', opacity: 0.9 }}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-light" style={{ color: '#886c44' }}>
                    {volunteer.name}
                  </h3>
                  <p className="text-sm" style={{ color: '#886c44', opacity: 0.7 }}>
                    {volunteer.area}
                  </p>
                  {volunteer.isActive === false ? (
                    <span
                      className="inline-block text-xs mt-1 px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: '#f5f3f0', color: '#886c44' }}
                    >
                      Inactive
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Back Button */}
          <button
            onClick={() => {
              setSelectedVolunteer(null);
              setIsEditing(false);
              setEditedData(null);
            }}
            className="mb-6 flex items-center gap-2 text-sm hover:opacity-70"
            style={{ color: '#886c44' }}
          >
            <span aria-hidden="true">&larr;</span>
            Back to all volunteers
          </button>

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ border: '1px solid #e8e6e3' }}>
            {/* Header with Photo */}
            <div className="p-8" style={{ backgroundColor: '#f5f3f0' }}>
              <div className="flex items-start gap-6">
                <div>
                  <img
                    src={isEditing ? editedData.photo : selectedVolunteer.photo}
                    alt={isEditing ? editedData.name : selectedVolunteer.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.photo}
                      onChange={(e) => handleInputChange('photo', e.target.value)}
                      className="mt-3 text-sm focus:outline-none bg-white px-3 py-2 rounded-lg w-56"
                      style={{ color: '#886c44', border: '1px solid #e8e6e3' }}
                      placeholder="Photo URL"
                    />
                  ) : null}
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-3xl font-light mb-2 focus:outline-none bg-transparent w-full"
                      style={{ color: '#886c44', borderBottom: '1px solid #886c44' }}
                    />
                  ) : (
                    <h2 className="text-3xl font-light mb-2" style={{ color: '#886c44' }}>
                      {selectedVolunteer.name}
                    </h2>
                  )}
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.area}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      className="focus:outline-none bg-transparent w-full"
                      style={{ color: '#886c44', opacity: 0.8, borderBottom: '1px solid #886c44' }}
                    />
                  ) : (
                    <p className="mb-4" style={{ color: '#886c44', opacity: 0.8 }}>
                      {selectedVolunteer.area}
                    </p>
                  )}
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full inline-block shadow-sm">
                    <Star className="w-4 h-4" style={{ color: '#886c44' }} />
                    <span className="font-medium" style={{ color: '#886c44' }}>
                      {isEditing ? editedData.hours : selectedVolunteer.hours} hours this year
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={handleToggleActive}
                        className="px-3 py-2 rounded-lg text-xs transition-colors"
                        style={{
                          border: '1px solid #e8e6e3',
                          color: '#886c44',
                          backgroundColor:
                            selectedVolunteer.isActive === false ? '#ffffff' : '#f5f3f0'
                        }}
                      >
                        {selectedVolunteer.isActive === false ? 'Restore' : 'Mark inactive'}
                      </button>
                      <button
                        onClick={() => handleEdit(selectedVolunteer)}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: '#886c44' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f5f3f0';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                        disabled={saving}
                      >
                        <Save className="w-5 h-5 text-green-700" />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-red-700" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField
                  icon={<Mail className="w-5 h-5" />}
                  label="Email"
                  value={isEditing ? editedData.email : selectedVolunteer.email}
                  isEditing={isEditing}
                  onChange={(val) => handleInputChange('email', val)}
                />
                <InfoField
                  icon={<Phone className="w-5 h-5" />}
                  label="Phone"
                  value={isEditing ? editedData.phone : selectedVolunteer.phone}
                  isEditing={isEditing}
                  onChange={(val) => handleInputChange('phone', val)}
                />
                <InfoField
                  icon={<MapPin className="w-5 h-5" />}
                  label="Address"
                  value={isEditing ? editedData.address : selectedVolunteer.address}
                  isEditing={isEditing}
                  onChange={(val) => handleInputChange('address', val)}
                  fullWidth
                />
                <InfoField
                  icon={<Calendar className="w-5 h-5" />}
                  label="Birthday"
                  value={isEditing ? editedData.birthday : selectedVolunteer.birthday}
                  isEditing={isEditing}
                  onChange={(val) => handleInputChange('birthday', val)}
                />
                <InfoField
                  icon={<AlertCircle className="w-5 h-5" />}
                  label="Emergency Contact"
                  value={isEditing ? editedData.emergencyContact : selectedVolunteer.emergencyContact}
                  isEditing={isEditing}
                  onChange={(val) => handleInputChange('emergencyContact', val)}
                  fullWidth
                />
              </div>

              {/* Background */}
              <div className="pt-4" style={{ borderTop: '1px solid #e8e6e3' }}>
                <h3 className="text-sm font-medium mb-2" style={{ color: '#886c44' }}>
                  Background
                </h3>
                {isEditing ? (
                  <textarea
                    value={editedData.background}
                    onChange={(e) => handleInputChange('background', e.target.value)}
                    className="w-full leading-relaxed rounded-lg p-3 focus:outline-none focus:ring-2"
                    style={{
                      color: '#886c44',
                      border: '1px solid #e8e6e3',
                      '--tw-ring-color': '#886c44'
                    }}
                    rows="3"
                  />
                ) : (
                  <p className="leading-relaxed" style={{ color: '#886c44' }}>
                    {selectedVolunteer.background}
                  </p>
                )}
              </div>

              {/* Notes */}
              <div className="pt-4" style={{ borderTop: '1px solid #e8e6e3' }}>
                <h3 className="text-sm font-medium mb-2" style={{ color: '#886c44' }}>
                  Internal Notes
                </h3>
                {isEditing ? (
                  <textarea
                    value={editedData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full text-sm leading-relaxed rounded-lg p-3 focus:outline-none focus:ring-2"
                    style={{
                      color: '#886c44',
                      opacity: 0.8,
                      border: '1px solid #e8e6e3',
                      backgroundColor: '#f5f3f0',
                      '--tw-ring-color': '#886c44'
                    }}
                    rows="2"
                  />
                ) : (
                  <p
                    className="text-sm leading-relaxed p-3 rounded-lg"
                    style={{ color: '#886c44', opacity: 0.8, backgroundColor: '#f5f3f0' }}
                  >
                    {selectedVolunteer.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoField = ({ icon, label, value, isEditing, onChange, fullWidth }) => (
  <div className={fullWidth ? 'md:col-span-2' : ''}>
    <div className="flex items-start gap-3">
      <div className="mt-0.5" style={{ color: '#886c44' }}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs mb-1" style={{ color: '#886c44', opacity: 0.7 }}>
          {label}
        </p>
        {isEditing ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="focus:outline-none bg-transparent w-full"
            style={{ color: '#886c44', borderBottom: '1px solid #886c44' }}
          />
        ) : (
          <p style={{ color: '#886c44' }}>{value}</p>
        )}
      </div>
    </div>
  </div>
);

export default VolunteerPortal;

export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  language: string;
  content: string;
}

export interface ProjectFolder {
  id: string;
  name: string;
  type: 'folder';
  children: (ProjectFolder | ProjectFile)[];
}

export const teklaProjectData: ProjectFolder = {
  id: 'root',
  name: 'TeklaAssistant',
  type: 'folder',
  children: [
    {
      id: 'sln',
      name: 'TeklaAssistant.sln',
      path: 'TeklaAssistant.sln',
      language: 'text',
      content: `Microsoft Visual Studio Solution File, Format Version 12.00
# Visual Studio Version 17
VisualStudioVersion = 17.8.34330.188
MinimumVisualStudioVersion = 10.0.40219.1
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "TeklaAssistant.UI", "TeklaAssistant.UI\\TeklaAssistant.UI.csproj", "{GUID1}"
EndProject
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "TeklaAssistant.Application", "TeklaAssistant.Application\\TeklaAssistant.Application.csproj", "{GUID2}"
EndProject
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "TeklaAssistant.Domain", "TeklaAssistant.Domain\\TeklaAssistant.Domain.csproj", "{GUID3}"
EndProject
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "TeklaAssistant.Infrastructure", "TeklaAssistant.Infrastructure\\TeklaAssistant.Infrastructure.csproj", "{GUID4}"
EndProject
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "TeklaAssistant.TeklaIntegration", "TeklaAssistant.TeklaIntegration\\TeklaAssistant.TeklaIntegration.csproj", "{GUID5}"
EndProject
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "TeklaAssistant.Shared", "TeklaAssistant.Shared\\TeklaAssistant.Shared.csproj", "{GUID6}"
EndProject
Global
    GlobalSection(SolutionConfigurationPlatforms) = preSolution
        Debug|Any CPU = Debug|Any CPU
        Release|Any CPU = Release|Any CPU
    EndGlobalSection
EndGlobal`
    },
    {
      id: 'domain',
      name: 'TeklaAssistant.Domain',
      type: 'folder',
      children: [
        {
          id: 'domain-enums',
          name: 'Enums',
          type: 'folder',
          children: [
            {
              id: 'domain-enums-status',
              name: 'ConnectionStatus.cs',
              path: 'TeklaAssistant.Domain/Enums/ConnectionStatus.cs',
              language: 'csharp',
              content: `namespace TeklaAssistant.Domain.Enums\n{\n    public enum ConnectionStatus\n    {\n        Disconnected,\n        TeklaNotRunning,\n        NoModelOpen,\n        Connected\n    }\n}`
            }
          ]
        },
        {
          id: 'domain-models',
          name: 'Models',
          type: 'folder',
          children: [
            {
              id: 'domain-models-details',
              name: 'ModelDetails.cs',
              path: 'TeklaAssistant.Domain/Models/ModelDetails.cs',
              language: 'csharp',
              content: `namespace TeklaAssistant.Domain.Models\n{\n    public class ModelDetails\n    {\n        public string Name { get; set; } = string.Empty;\n        public string Path { get; set; } = string.Empty;\n        public string TeklaVersion { get; set; } = string.Empty;\n    }\n}`
            }
          ]
        },
        {
          id: 'domain-interfaces',
          name: 'Interfaces',
          type: 'folder',
          children: [
            {
              id: 'domain-interfaces-service',
              name: 'ITeklaConnectionService.cs',
              path: 'TeklaAssistant.Domain/Interfaces/ITeklaConnectionService.cs',
              language: 'csharp',
              content: `using TeklaAssistant.Domain.Enums;\nusing TeklaAssistant.Domain.Models;\n\nnamespace TeklaAssistant.Domain.Interfaces\n{\n    public interface ITeklaConnectionService\n    {\n        ConnectionStatus CheckConnection();\n        ModelDetails GetModelDetails();\n    }\n}`
            }
          ]
        }
      ]
    },
    {
      id: 'integration',
      name: 'TeklaAssistant.TeklaIntegration',
      type: 'folder',
      children: [
        {
          id: 'integration-services',
          name: 'Services',
          type: 'folder',
          children: [
            {
              id: 'integration-services-tekla',
              name: 'TeklaConnectionService.cs',
              path: 'TeklaAssistant.TeklaIntegration/Services/TeklaConnectionService.cs',
              language: 'csharp',
              content: `using System;\nusing Tekla.Structures.Model;\nusing TeklaAssistant.Domain.Enums;\nusing TeklaAssistant.Domain.Interfaces;\nusing TeklaAssistant.Domain.Models;\n\nnamespace TeklaAssistant.TeklaIntegration.Services\n{\n    public class TeklaConnectionService : ITeklaConnectionService\n    {\n        public ConnectionStatus CheckConnection()\n        {\n            try\n            {\n                Model model = new Model();\n                if (!model.GetConnectionStatus())\n                {\n                    return ConnectionStatus.TeklaNotRunning;\n                }\n\n                ModelInfo info = model.GetInfo();\n                if (string.IsNullOrEmpty(info.ModelName))\n                {\n                    return ConnectionStatus.NoModelOpen;\n                }\n\n                return ConnectionStatus.Connected;\n            }\n            catch (Exception)\n            {\n                // TODO: Log exception via ILogger in Infrastructure layer\n                return ConnectionStatus.Disconnected;\n            }\n        }\n\n        public ModelDetails GetModelDetails()\n        {\n            var details = new ModelDetails();\n            try\n            {\n                Model model = new Model();\n                if (model.GetConnectionStatus())\n                {\n                    ModelInfo info = model.GetInfo();\n                    details.Name = info.ModelName;\n                    details.Path = info.ModelPath;\n                    \n                    // Fetching exact Tekla version typically requires Tekla.Structures.dll \n                    // (e.g. Tekla.Structures.StructuresSetup.GetEnvironmentVariables())\n                    details.TeklaVersion = "Available via Tekla.Structures API";\n                }\n            }\n            catch (Exception)\n            {\n                // TODO: Log exception\n            }\n            return details;\n        }\n    }\n}`
            }
          ]
        }
      ]
    },
    {
      id: 'ui',
      name: 'TeklaAssistant.UI',
      type: 'folder',
      children: [
        {
          id: 'ui-app-xaml',
          name: 'App.xaml',
          path: 'TeklaAssistant.UI/App.xaml',
          language: 'xml',
          content: `<Application x:Class="TeklaAssistant.UI.App"\n             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"\n             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"\n             xmlns:materialDesign="http://materialdesigninxaml.net/winfx/xaml/themes">\n    <Application.Resources>\n        <ResourceDictionary>\n            <ResourceDictionary.MergedDictionaries>\n                <materialDesign:BundledTheme BaseTheme="Dark" PrimaryColor="DeepPurple" SecondaryColor="Teal" />\n                <ResourceDictionary Source="pack://application:,,,/MaterialDesignThemes.Wpf;component/Themes/MaterialDesignTheme.Defaults.xaml" />\n            </ResourceDictionary.MergedDictionaries>\n        </ResourceDictionary>\n    </Application.Resources>\n</Application>`
        },
        {
          id: 'ui-app-cs',
          name: 'App.xaml.cs',
          path: 'TeklaAssistant.UI/App.xaml.cs',
          language: 'csharp',
          content: `using System.Windows;\nusing Microsoft.Extensions.DependencyInjection;\nusing Microsoft.Extensions.Hosting;\nusing TeklaAssistant.Domain.Interfaces;\nusing TeklaAssistant.TeklaIntegration.Services;\nusing TeklaAssistant.UI.ViewModels;\nusing TeklaAssistant.UI.Views;\nusing Serilog;\n\nnamespace TeklaAssistant.UI\n{\n    public partial class App : Application\n    {\n        public static IHost? AppHost { get; private set; }\n\n        public App()\n        {\n            AppHost = Host.CreateDefaultBuilder()\n                .UseSerilog((context, configuration) =>\n                {\n                    configuration.WriteTo.File("logs/tekla-assistant.txt", rollingInterval: RollingInterval.Day);\n                })\n                .ConfigureServices((context, services) =>\n                {\n                    // Register Views\n                    services.AddSingleton<MainWindow>();\n                    \n                    // Register ViewModels\n                    services.AddTransient<MainViewModel>();\n\n                    // Register Domain Services (Integration)\n                    services.AddSingleton<ITeklaConnectionService, TeklaConnectionService>();\n                })\n                .Build();\n        }\n\n        protected override async void OnStartup(StartupEventArgs e)\n        {\n            base.OnStartup(e);\n            await AppHost!.StartAsync();\n\n            var mainWindow = AppHost.Services.GetRequiredService<MainWindow>();\n            mainWindow.Show();\n        }\n\n        protected override async void OnExit(ExitEventArgs e)\n        {\n            await AppHost!.StopAsync();\n            base.OnExit(e);\n        }\n    }\n}`
        },
        {
          id: 'ui-viewmodels',
          name: 'ViewModels',
          type: 'folder',
          children: [
            {
              id: 'ui-viewmodels-main',
              name: 'MainViewModel.cs',
              path: 'TeklaAssistant.UI/ViewModels/MainViewModel.cs',
              language: 'csharp',
              content: `using System;\nusing System.ComponentModel;\nusing System.Runtime.CompilerServices;\nusing System.Windows.Input;\nusing TeklaAssistant.Domain.Enums;\nusing TeklaAssistant.Domain.Interfaces;\nusing TeklaAssistant.Domain.Models;\n\nnamespace TeklaAssistant.UI.ViewModels\n{\n    public class MainViewModel : INotifyPropertyChanged\n    {\n        private readonly ITeklaConnectionService _teklaService;\n\n        private string _connectionStatusText = "Disconnected";\n        public string ConnectionStatusText\n        {\n            get => _connectionStatusText;\n            set { _connectionStatusText = value; OnPropertyChanged(); }\n        }\n\n        private bool _isTeklaRunning;\n        public bool IsTeklaRunning\n        {\n            get => _isTeklaRunning;\n            set { _isTeklaRunning = value; OnPropertyChanged(); }\n        }\n\n        private bool _isModelOpen;\n        public bool IsModelOpen\n        {\n            get => _isModelOpen;\n            set { _isModelOpen = value; OnPropertyChanged(); }\n        }\n\n        private string _modelName = "-";\n        public string ModelName\n        {\n            get => _modelName;\n            set { _modelName = value; OnPropertyChanged(); }\n        }\n\n        private string _modelPath = "-";\n        public string ModelPath\n        {\n            get => _modelPath;\n            set { _modelPath = value; OnPropertyChanged(); }\n        }\n\n        public ICommand ConnectCommand { get; }\n\n        public MainViewModel(ITeklaConnectionService teklaService)\n        {\n            _teklaService = teklaService;\n            ConnectCommand = new RelayCommand(ConnectToTekla);\n        }\n\n        private void ConnectToTekla()\n        {\n            var status = _teklaService.CheckConnection();\n\n            switch (status)\n            {\n                case ConnectionStatus.TeklaNotRunning:\n                    IsTeklaRunning = false;\n                    IsModelOpen = false;\n                    ConnectionStatusText = "Tekla is not running.";\n                    ClearModelInfo();\n                    break;\n                case ConnectionStatus.NoModelOpen:\n                    IsTeklaRunning = true;\n                    IsModelOpen = false;\n                    ConnectionStatusText = "Tekla is running, but no model is open.";\n                    ClearModelInfo();\n                    break;\n                case ConnectionStatus.Connected:\n                    IsTeklaRunning = true;\n                    IsModelOpen = true;\n                    ConnectionStatusText = "Connected to Tekla model successfully.";\n                    LoadModelInfo();\n                    break;\n                default:\n                    IsTeklaRunning = false;\n                    IsModelOpen = false;\n                    ConnectionStatusText = "Disconnected.";\n                    ClearModelInfo();\n                    break;\n            }\n        }\n\n        private void LoadModelInfo()\n        {\n            var info = _teklaService.GetModelDetails();\n            ModelName = string.IsNullOrEmpty(info.Name) ? "-" : info.Name;\n            ModelPath = string.IsNullOrEmpty(info.Path) ? "-" : info.Path;\n        }\n\n        private void ClearModelInfo()\n        {\n            ModelName = "-";\n            ModelPath = "-";\n        }\n\n        public event PropertyChangedEventHandler? PropertyChanged;\n        protected void OnPropertyChanged([CallerMemberName] string? propertyName = null)\n        {\n            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));\n        }\n    }\n\n    public class RelayCommand : ICommand\n    {\n        private readonly Action _execute;\n        public RelayCommand(Action execute) => _execute = execute;\n        public bool CanExecute(object? parameter) => true;\n        public void Execute(object? parameter) => _execute();\n        public event EventHandler? CanExecuteChanged;\n    }\n}`
            }
          ]
        },
        {
          id: 'ui-views',
          name: 'Views',
          type: 'folder',
          children: [
            {
              id: 'ui-views-main-xaml',
              name: 'MainWindow.xaml',
              path: 'TeklaAssistant.UI/Views/MainWindow.xaml',
              language: 'xml',
              content: `<Window x:Class="TeklaAssistant.UI.Views.MainWindow"\n        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"\n        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"\n        xmlns:materialDesign="http://materialdesigninxaml.net/winfx/xaml/themes"\n        Title="Tekla Assistant - Phase 1" Height="450" Width="600"\n        TextElement.Foreground="{DynamicResource MaterialDesignBody}"\n        Background="{DynamicResource MaterialDesignPaper}"\n        WindowStartupLocation="CenterScreen">\n    <Grid Margin="24">\n        <Grid.RowDefinitions>\n            <RowDefinition Height="Auto"/>\n            <RowDefinition Height="*"/>\n            <RowDefinition Height="Auto"/>\n        </Grid.RowDefinitions>\n\n        <!-- Header -->\n        <StackPanel Grid.Row="0" Orientation="Horizontal" Margin="0,0,0,24">\n            <materialDesign:PackIcon Kind="CubeOutline" Width="32" Height="32" VerticalAlignment="Center" Foreground="{DynamicResource PrimaryHueMidBrush}" Margin="0,0,12,0"/>\n            <TextBlock Text="Tekla Assistant" FontSize="28" FontWeight="Bold" VerticalAlignment="Center"/>\n        </StackPanel>\n\n        <!-- Status Card -->\n        <materialDesign:Card Grid.Row="1" Padding="24" UniformCornerRadius="8" Background="{DynamicResource MaterialDesignCardBackground}">\n            <StackPanel>\n                <TextBlock Text="Connection Details" FontSize="18" FontWeight="SemiBold" Margin="0,0,0,16" Foreground="{DynamicResource PrimaryHueMidBrush}"/>\n\n                <Grid Margin="0,8">\n                    <Grid.ColumnDefinitions>\n                        <ColumnDefinition Width="Auto" SharedSizeGroup="Icon"/>\n                        <ColumnDefinition Width="150"/>\n                        <ColumnDefinition Width="*"/>\n                    </Grid.ColumnDefinitions>\n                    <materialDesign:PackIcon Kind="ServerNetwork" VerticalAlignment="Center" Margin="0,0,12,0" Grid.Column="0"/>\n                    <TextBlock Text="Tekla Running:" FontWeight="Bold" Grid.Column="1" VerticalAlignment="Center"/>\n                    <TextBlock Text="{Binding IsTeklaRunning}" Grid.Column="2" VerticalAlignment="Center"/>\n                </Grid>\n\n                <Grid Margin="0,8">\n                    <Grid.ColumnDefinitions>\n                        <ColumnDefinition Width="Auto" SharedSizeGroup="Icon"/>\n                        <ColumnDefinition Width="150"/>\n                        <ColumnDefinition Width="*"/>\n                    </Grid.ColumnDefinitions>\n                    <materialDesign:PackIcon Kind="FolderOpen" VerticalAlignment="Center" Margin="0,0,12,0" Grid.Column="0"/>\n                    <TextBlock Text="Model Opened:" FontWeight="Bold" Grid.Column="1" VerticalAlignment="Center"/>\n                    <TextBlock Text="{Binding IsModelOpen}" Grid.Column="2" VerticalAlignment="Center"/>\n                </Grid>\n\n                <Grid Margin="0,8">\n                    <Grid.ColumnDefinitions>\n                        <ColumnDefinition Width="Auto" SharedSizeGroup="Icon"/>\n                        <ColumnDefinition Width="150"/>\n                        <ColumnDefinition Width="*"/>\n                    </Grid.ColumnDefinitions>\n                    <materialDesign:PackIcon Kind="LanConnect" VerticalAlignment="Center" Margin="0,0,12,0" Grid.Column="0"/>\n                    <TextBlock Text="Connection Status:" FontWeight="Bold" Grid.Column="1" VerticalAlignment="Center"/>\n                    <TextBlock Text="{Binding ConnectionStatusText}" Grid.Column="2" VerticalAlignment="Center" Foreground="{DynamicResource SecondaryHueMidBrush}"/>\n                </Grid>\n\n                <Separator Margin="0,16" Background="{DynamicResource MaterialDesignDivider}"/>\n\n                <Grid Margin="0,8">\n                    <Grid.ColumnDefinitions>\n                        <ColumnDefinition Width="Auto" SharedSizeGroup="Icon"/>\n                        <ColumnDefinition Width="150"/>\n                        <ColumnDefinition Width="*"/>\n                    </Grid.ColumnDefinitions>\n                    <materialDesign:PackIcon Kind="FileDocumentOutline" VerticalAlignment="Center" Margin="0,0,12,0" Grid.Column="0"/>\n                    <TextBlock Text="Model Name:" FontWeight="Bold" Grid.Column="1" VerticalAlignment="Center"/>\n                    <TextBlock Text="{Binding ModelName}" Grid.Column="2" VerticalAlignment="Center" TextTrimming="CharacterEllipsis"/>\n                </Grid>\n\n                <Grid Margin="0,8">\n                    <Grid.ColumnDefinitions>\n                        <ColumnDefinition Width="Auto" SharedSizeGroup="Icon"/>\n                        <ColumnDefinition Width="150"/>\n                        <ColumnDefinition Width="*"/>\n                    </Grid.ColumnDefinitions>\n                    <materialDesign:PackIcon Kind="FolderNetwork" VerticalAlignment="Center" Margin="0,0,12,0" Grid.Column="0"/>\n                    <TextBlock Text="Model Path:" FontWeight="Bold" Grid.Column="1" VerticalAlignment="Top"/>\n                    <TextBlock Text="{Binding ModelPath}" Grid.Column="2" VerticalAlignment="Top" TextWrapping="Wrap"/>\n                </Grid>\n            </StackPanel>\n        </materialDesign:Card>\n\n        <!-- Footer / Button -->\n        <StackPanel Grid.Row="2" Orientation="Horizontal" HorizontalAlignment="Right" Margin="0,24,0,0">\n            <Button Command="{Binding ConnectCommand}" \n                    Style="{StaticResource MaterialDesignRaisedButton}" \n                    materialDesign:ButtonAssist.CornerRadius="6"\n                    Width="200" Height="40">\n                <StackPanel Orientation="Horizontal">\n                    <materialDesign:PackIcon Kind="Connection" VerticalAlignment="Center" Margin="0,0,8,0"/>\n                    <TextBlock Text="Connect To Tekla" VerticalAlignment="Center"/>\n                </StackPanel>\n            </Button>\n        </StackPanel>\n    </Grid>\n</Window>`
            },
            {
              id: 'ui-views-main-cs',
              name: 'MainWindow.xaml.cs',
              path: 'TeklaAssistant.UI/Views/MainWindow.xaml.cs',
              language: 'csharp',
              content: `using System.Windows;\nusing TeklaAssistant.UI.ViewModels;\n\nnamespace TeklaAssistant.UI.Views\n{\n    public partial class MainWindow : Window\n    {\n        public MainWindow(MainViewModel viewModel)\n        {\n            InitializeComponent();\n            DataContext = viewModel;\n        }\n    }\n}`
            }
          ]
        }
      ]
    }
  ]
};
